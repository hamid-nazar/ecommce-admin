"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BillboardColumnType, billboardcolumns } from '@/features/billboard/BillboardColumn';
import { DataTable } from '@/components/ui/DataTable';
import { ApiList } from '../../components/ui/ApiList';


interface BillboardClientProps{
  data: BillboardColumnType[]
}

export function BillboardClient({data}: BillboardClientProps) {
    const router = useRouter();
    const params = useParams();

    
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
         title={`Billboards (${data.length})`}
         description="Manage billboards for your store" />
         <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="w-4 h-4 mr-2"/>
           Add New
         </Button>
    </div>
    <Separator/>
    <DataTable data={data} columns={billboardcolumns} searchKey='label' />
    <Heading title="API" description="API calls for Billboards"/>
    <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}
