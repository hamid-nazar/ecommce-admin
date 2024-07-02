"use client"

import { ColumnDef } from "@tanstack/react-table"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumnType = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const orderColumns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
        accessorKey: "products",
        header: "Products",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
      accessorKey: "isPaid",
      header: "Paid",
  },
  {
      accessorKey: "createdAt",
    header: "Date",
  },
]
