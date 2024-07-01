"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SizeCellAction } from "@/features/size/SizeCellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumnType = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const sizeColumns: ColumnDef<SizeColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",},
    {
    accessorKey: "value",
    header: "Value",},
    {
    accessorKey: "createdAt",
    header: "Date",},
  {
    id: "actions",
    cell: ({ row }) => <SizeCellAction data={row.original} />,
  },
]
