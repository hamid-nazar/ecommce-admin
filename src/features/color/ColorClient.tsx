"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ColorColumnType, colorColumns } from '@/features/color/ColorColumn';
import { DataTable } from '@/components/ui/DataTable';
import { ApiList } from '../../components/ui/ApiList';


interface ColorClientProps{
  data: ColorColumnType[]
}

export function ColorClient({data}: ColorClientProps) {
    const router = useRouter();
    const params = useParams();

    
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
         title={`Colors (${data.length})`}
         description="Manage colors for your store" />
         <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <Plus className="w-4 h-4 mr-2"/>
           Add New
         </Button>
    </div>
    <Separator/>
    <DataTable data={data} columns={colorColumns} searchKey='name' />
    <Heading title="API" description="API calls for Colors"/>
    <Separator/>
    <ApiList entityName="colors" entityIdName="colorId" />
    </>
  )
}
