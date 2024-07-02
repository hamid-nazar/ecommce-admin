"use client";
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { OrderColumnType, orderColumns } from '@/features/order/OrderColumn';
import { DataTable } from '@/components/ui/DataTable';


interface OrderClientProps{
  data: OrderColumnType[]
}

export function OrderClient({data}: OrderClientProps) {

  return (
    <>
      <Heading
      title={`Orders (${data.length})`}
      description="Manage orders for your store" />
    
      <Separator/>
      
      <DataTable data={data} columns={orderColumns} searchKey='products' />
    </>
  )
}
