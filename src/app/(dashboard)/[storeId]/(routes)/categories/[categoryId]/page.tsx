import { CategoryForm } from '@/features/category/CategoryForm';
import prismadb from '@/lib/prismadb'
import React from 'react'

export default async function CategoryPage({params}: {params: { categoryId: string, storeId: string }}) {
  
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });


    return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <CategoryForm initialData={category} billboards={billboards}/>
        </div>
    </div>
  )
}
