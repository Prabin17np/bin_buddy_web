"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { filterBySearch } from "@/app/utils/pagination";
import {
  Card, Table, Tr, Td, Button, Input, Select,
  Pagination, Spinner, Alert, EmptyState, Modal, Avatar, Badge,
} from "@/app/utils/ui";
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "@/lib/action/admin/admin-action";

// ── Real User shape from your Mongoose schema ──────────────────────────────
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "user" | "admin";
  profilePicture?: string | null | undefined;
  points?: number;
  createdAt?: string;
}

const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "User",      value: "user"  },
  { label: "Admin",     value: "admin" },
];

const EMPTY_FORM: {
  firstName: string; lastName: string; username: string;
  email: string; role: "user" | "admin"; password: string;
} = {
  firstName: "", lastName: "", username: "",
  email: "", role: "user", password: "",
};

const PAGE_SIZE = 8;

const fullName = (u: User) =>
  `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username;

// Backend stores profilePicture as "/uploads/filename.png"
// Backend serves static files at: app.use("/api/v1/uploads", express.static(...))
// So full URL = http://localhost:5000/api/v1/uploads/filename.png
// Set NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1 in .env.local
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1").replace(/\/$/, "");

const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  // "/uploads/abc.png" → "http://localhost:5000/api/v1/uploads/abc.png"
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,         setUsers]         = useState<User[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [roleFilter,    setRoleFilter]    = useState("");
  const [page,          setPage]          = useState(1);
  const [success,       setSuccess]       = useState("");
  const [error,         setError]         = useState("");
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editUser,      setEditUser]      = useState<User | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<User | null>(null);
  const [form,          setForm]          = useState({ ...EMPTY_FORM });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting,    setSubmitting]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Flash ──────────────────────────────────────────────────────────────
  const flash = (msg: string, type: "success" | "error" = "success") => {
    type === "success" ? setSuccess(msg) : setError(msg);
    setTimeout(() => type === "success" ? setSuccess("") : setError(""), 3500);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminGetUsers();
      if (res.success && res.data) {
        // Backend: res.json({ success, data: users, pagination })
        // So res.data is the User[] array directly
        const raw = res.data as any;
        // Chain: backend → { success, data: User[], pagination }
        //   apiGetAllUsers returns res.data (the full axios response body)
        //   adminGetUsers action wraps it: { success: true, data: axiosBody }
        // So: res.data = axiosBody = { success, data: User[], pagination }
        //     res.data.data = User[]
        const list: User[] =
          Array.isArray(raw)        ? raw          // plain array
          : Array.isArray(raw?.data)? raw.data     // { data: User[] } ← most likely
          : raw?.users              ? raw.users    // { users: User[] }
          : [];
        setUsers(list);
      } else {
        flash(res.message ?? "Failed to load users.", "error");
      }
    } catch (e: any) {
      flash(e?.message ?? "Unexpected error loading users.", "error");
    }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Filter → search → paginate ─────────────────────────────────────────
  const byRole    = roleFilter ? users.filter(u => u.role === roleFilter) : users;
  const searched  = filterBySearch(
    byRole as unknown as Record<string, unknown>[],
    search,
    ["firstName", "lastName", "username", "email"] as any,
  ) as unknown as User[];
  const totalPages = Math.max(1, Math.ceil(searched.length / PAGE_SIZE));
  const paginated  = searched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Modal helpers ──────────────────────────────────────────────────────
  const openCreate = () => {
    setEditUser(null);
    setForm({ ...EMPTY_FORM });
    setAvatarPreview(null);
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({
      firstName: u.firstName ?? "", lastName: u.lastName ?? "",
      username: u.username,         email: u.email,
      role: u.role,                 password: "",
    });
    setAvatarPreview(getImageUrl(u.profilePicture) ?? null);
    setModalOpen(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.username) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (fileRef.current?.files?.[0])
        fd.append("profilePicture", fileRef.current.files[0]);

      if (editUser) {
        const res = await adminUpdateUser(editUser._id, fd);
        if (res.success) {
          setUsers(prev => prev.map(u => u._id === editUser._id
            ? { ...u, ...form, role: form.role as User["role"], profilePicture: avatarPreview ?? u.profilePicture }
            : u));
          flash("User updated.");
        } else flash(res.message ?? "Update failed.", "error");
      } else {
        const res = await adminCreateUser(fd);
        if (res.success) {
          setUsers(prev => [res.data as User, ...prev]);
          flash("User created.");
        } else flash(res.message ?? "Create failed.", "error");
      }
      setModalOpen(false);
    } catch { flash("Unexpected error.", "error"); }
    finally   { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await adminDeleteUser(deleteTarget._id);
      if (res.success) {
        setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
        flash("User deleted.");
      } else flash(res.message ?? "Delete failed.", "error");
    } catch { flash("Unexpected error.", "error"); }
    finally   { setDeleteTarget(null); }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {success && <Alert type="success" message={success} />}
      {error   && <Alert type="error"   message={error}   />}

      <Card>
        {/* Toolbar — mirrors your AdminReportsPage style */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            className="flex-1"
            placeholder="🔍 Search name, username, email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <Select
            value={roleFilter}
            onChange={v => { setRoleFilter(v); setPage(1); }}
            options={ROLE_OPTIONS}
          />
          <Button variant="secondary" size="sm" onClick={load}>↻ Refresh</Button>
          <Button onClick={openCreate}>+ Add User</Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8" />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState icon="👥" title="No users found"
            desc="Try adjusting your search or add a new user." />
        ) : (
          <Table headers={["User", "Email", "Role", "Points", "Joined", "Actions"]}>
            {paginated.map(user => (
              <Tr key={user._id}>

                {/* Profile picture from user.profilePicture (your schema field) */}
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar src={getImageUrl(user.profilePicture)} name={fullName(user)} size="sm" />
                    <div>
                      <p className="font-medium text-gray-700">{fullName(user)}</p>
                      <p className="text-xs text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                </Td>

                <Td className="text-sm text-gray-500">{user.email}</Td>

                <Td>
                  <Badge variant={user.role === "admin" ? "purple" : "blue"}>
                    {user.role}
                  </Badge>
                </Td>

                <Td className="text-sm text-gray-500">{user.points ?? 0} pts</Td>

                <Td className="text-xs text-gray-400">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })
                    : "—"}
                </Td>

                <Td>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(user)}>
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      {/* ── Create / Edit Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editUser ? "Edit User" : "Add New User"}
      >
        <div className="space-y-4">

          {/* Shows the user's real profilePicture; falls back to placeholder */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden
                            flex items-center justify-center border">
              {avatarPreview
                ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                : <span className="text-3xl">👤</span>}
            </div>
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              {avatarPreview ? "Change Photo" : "Upload Photo"}
            </Button>
            <input ref={fileRef} type="file" accept="image/*"
              className="hidden" onChange={handleFile} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" placeholder="Jane"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last Name" placeholder="Doe"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>

          <Input label="Username *" placeholder="janedoe"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} />

          <Input label="Email *" type="email" placeholder="jane@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />

          <Select label="Role" value={form.role}
            onChange={v => setForm({ ...form, role: v as "user" | "admin" })}
            options={[{ label: "User", value: "user" }, { label: "Admin", value: "admin" }]} />

          {!editUser && (
            <Input label="Password *" type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !form.firstName || !form.email || !form.username}
            >
              {submitting ? "Saving…" : editUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
      >
        <p className="text-sm text-gray-600 mb-4">
          Delete <strong>{deleteTarget ? fullName(deleteTarget) : ""}</strong>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}