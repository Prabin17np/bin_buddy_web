/* eslint-disable react-hooks/incompatible-library */
"use client";

import DataTable from "react-data-table-component";
export default function DisplayUserTable() {
  type Person = {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  };
  const users: Person[] = [
    {
      userId: "id101",
      firstName: "tanner",
      lastName: "linsley",
      username: "tanner",
      email: "tanner@gmail.com",
      role: "user",
    },
    {
      userId: "id102",
      firstName: "tandy",
      lastName: "miller",
      username: "miller",
      email: "miller@gmail.com",
      role: "user",
    },
    {
      userId: "id103",
      firstName: "joe",
      lastName: "dirte",
      username: "joe",
      email: "dirte@gmail.com",
      role: "user",
    },
  ];
  const userColumns = [
    {
      name: "User ID",
      selector: (row: { userId: string }) => row.userId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: { username: string }) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: { email: string }) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: { role: string }) => row.role,
      sortable: true,
    },
  ];
  return (
    <div className="mb-8 mt-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">User List</h1>

      <DataTable
        columns={userColumns}
        data={users}
        pagination
        highlightOnHover
        keyField="userId"
        className="w-full border-collapse"
      />
    </div>
  );
}
