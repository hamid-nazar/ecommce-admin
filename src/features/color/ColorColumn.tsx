"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SizeCellAction } from "@/features/size/SizeCellAction";
import { ColorCellAction } from "./ColorCellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumnType = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const colorColumns: ColumnDef<ColorColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",},
    {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.value}
          <div
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: row.original.value }}
          />
        </div>
      )
    },
  },
    {
    accessorKey: "createdAt",
    header: "Date",},
  {
    id: "actions",
    cell: ({ row }) => <ColorCellAction data={row.original} />,
  },
]
