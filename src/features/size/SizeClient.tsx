"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SizeColumnType, sizeColumns } from '@/features/size/SizeColumn';
import { DataTable } from '@/components/ui/DataTable';
import { ApiList } from '@/components/ui/ApiList';


interface SizeClientProps{
  data: SizeColumnType[]
}

export function SizeClient({data}: SizeClientProps) {
    const router = useRouter();
    const params = useParams();

    
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
         title={`Sizes (${data.length})`}
         description="Manage sizes for your store" />
         <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className="w-4 h-4 mr-2"/>
           Add New
         </Button>
    </div>
    <Separator/>
    <DataTable data={data} columns={sizeColumns} searchKey='name' />
    <Heading title="API" description="API calls for Sizes"/>
    <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  )
}
