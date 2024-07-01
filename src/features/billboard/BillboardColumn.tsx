"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillboardCellAction } from "@/features/billboard/BillboardCellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumnType = {
  id: string
  label: string
   createdAt: string
}

export const billboardcolumns: ColumnDef<BillboardColumnType>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <BillboardCellAction data={row.original} />,
  },
]
