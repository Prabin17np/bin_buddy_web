"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Card, Table, Tr, Td, Button, Input, Select,
  StatusBadge, Pagination, Spinner, Alert, EmptyState, Modal
} from "@/app/utils/ui";
import { filterBySearch } from "@/app/utils/pagination";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";

const STATUS_OPTIONS = [
  { label: "All Reports", value: "" },
  { label: "Pending",     value: "pending"  },
  { label: "Open",        value: "open"     },
  { label: "Resolved",    value: "resolved" },
  { label: "Rejected",    value: "rejected" },
];

export default function AdminReportsPage() {
  const [reports, setReports]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [success, setSuccess]           = useState("");
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]                 = useState(1);
  const [viewReport, setViewReport]     = useState<any | null>(null);
  const [resolving, setResolving]       = useState<string | null>(null);

  const PAGE_SIZE = 8;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(API.ADMIN.REPORT.GET_ALL);
      const data = res.data?.data ?? [];
      // Sort newest first
      setReports([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filterBySearch(reports, search, ["title", "location", "type"])
    .filter((r) => !statusFilter || r.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (reportId: string, status: string) => {
    setResolving(reportId);
    try {
      await axios.patch(API.ADMIN.REPORT.UPDATE(reportId), { status });
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status } : r));
      if (viewReport?._id === reportId) setViewReport((v: any) => ({ ...v, status }));
      setSuccess(`Report marked as ${status}.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to update report");
      setTimeout(() => setError(""), 3000);
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-4">
      {success && <Alert type="success" message={success} />}
      {error   && <Alert type="error"   message={error}   />}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="🔍 Search reports..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
            options={STATUS_OPTIONS}
          />
          <Button variant="secondary" size="sm" onClick={load}>↻ Refresh</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>
        ) : paginated.length === 0 ? (
          <EmptyState icon="📋" title="No reports found" />
        ) : (
          <Table headers={["Title", "Submitted By", "Location", "Type", "Status", "Date", "Actions"]}>
            {paginated.map((report) => (
              <Tr key={report._id}>
                <Td>
                  <p className="font-medium text-gray-700 max-w-[180px] truncate">{report.title ?? report.type}</p>
                </Td>
                <Td className="text-sm text-gray-500">
                  {report.userId?.name ?? report.userId?.email ?? "—"}
                </Td>
                <Td className="text-sm text-gray-500">📍 {report.location}</Td>
                <Td className="text-sm text-gray-500 capitalize">{report.type?.replace("_", " ") ?? "—"}</Td>
                <Td><StatusBadge status={report.status} /></Td>
                <Td className="text-xs text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setViewReport(report)}>View</Button>
                    {(report.status === "pending" || report.status === "open") && (
                      <Button size="sm"
                        disabled={resolving === report._id}
                        onClick={() => updateStatus(report._id, "resolved")}>
                        {resolving === report._id ? "…" : "Resolve"}
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      {/* View Report Modal */}
      <Modal open={!!viewReport} onClose={() => setViewReport(null)} title="Report Details">
        {viewReport && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">{viewReport.title ?? viewReport.type}</h4>
              <StatusBadge status={viewReport.status} />
            </div>

            {viewReport.description && (
              <p className="text-sm text-gray-600">{viewReport.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Submitted by</p>
                <p className="font-medium">{viewReport.userId?.name ?? viewReport.userId?.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Location</p>
                <p className="font-medium">📍 {viewReport.location}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="font-medium capitalize">{viewReport.type?.replace("_", " ") ?? "—"}</p>
              </div>
              {viewReport.severity && (
                <div>
                  <p className="text-gray-400 text-xs">Severity</p>
                  <p className="font-medium capitalize">{viewReport.severity}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-xs">Date</p>
                <p className="font-medium">
                  {new Date(viewReport.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {viewReport.photoUrl && (
              <img src={viewReport.photoUrl} alt="report" className="w-full h-40 object-cover rounded-xl" />
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {(viewReport.status === "pending" || viewReport.status === "open") && (
                <>
                  <Button className="flex-1"
                    disabled={resolving === viewReport._id}
                    onClick={() => updateStatus(viewReport._id, "resolved")}>
                    ✅ Mark Resolved
                  </Button>
                  <Button variant="danger" className="flex-1"
                    disabled={resolving === viewReport._id}
                    onClick={() => updateStatus(viewReport._id, "rejected")}>
                    ❌ Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}