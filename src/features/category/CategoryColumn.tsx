"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CategoryCellAction } from "@/features/category/CategoryCellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumnType = {
  id: string
  name: string
  billboardLabel: string
 createdAt: string
}

export const categoryColumns: ColumnDef<CategoryColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryCellAction data={row.original} />,
  },
]
