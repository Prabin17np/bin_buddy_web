import Link from "next/link";
import DisplayUserTable from "./_components/DisplayUserTable";

export default function Page() {
  return (
    <div>
      <DisplayUserTable />
      <Link
        className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
        href="/admin/users/create"
      >
        Create User
      </Link>
    </div>
  );
}
