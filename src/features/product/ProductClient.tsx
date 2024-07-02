"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/DataTable';
import { ApiList } from '../../components/ui/ApiList';
import { ProductColumnType, productColumns } from '@/features/product/ProductColumn';


interface ProductClientProps{
  data: ProductColumnType[]
}

export function ProductClient({data}: ProductClientProps) {
    const router = useRouter();
    const params = useParams();

    
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
         title={`Products (${data.length})`}
         description="Manage products for your store" />
         <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <Plus className="w-4 h-4 mr-2"/>
           Add New
         </Button>
    </div>
    <Separator/>
    <DataTable data={data} columns={productColumns} searchKey='name' />
    <Heading title="API" description="API calls for Products"/>
    <Separator/>
    <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}
