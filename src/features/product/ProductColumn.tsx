"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillboardCellAction } from "@/features/billboard/BillboardCellAction";
import { ProductCellAction } from "@/features/product/ProductCellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumnType = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const productColumns: ColumnDef<ProductColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="w-6 h-6 rounded-full border" style={{backgroundColor: row.original.color}}/>
      </div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductCellAction data={row.original} />,
  },
]
