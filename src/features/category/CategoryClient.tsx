"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CategoryColumnType, categoryColumns } from './CategoryColumn';
import { DataTable } from '@/components/ui/DataTable';
import { ApiList } from '@/components/ui/ApiList';


interface CategoryClientProps {
  data: CategoryColumnType[]
}

export function CategoryClient({data}: CategoryClientProps) {
    const router = useRouter();
    const params = useParams();

    
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
         title={`Categories (${data.length})`}
         description="Manage categories for your store" />
         <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
            <Plus className="w-4 h-4 mr-2"/>
           Add New
         </Button>
    </div>
    <Separator/>
    <DataTable data={data} columns={categoryColumns} searchKey='name' />
    <Heading title="API" description="API calls for Categories"/>
    <Separator/>
    <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  )
}
