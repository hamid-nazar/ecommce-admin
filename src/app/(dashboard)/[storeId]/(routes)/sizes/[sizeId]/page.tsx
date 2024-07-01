import { SizeForm } from '@/features/size/SizeForm';
import prismadb from '@/lib/prismadb'
import React from 'react'

export default async function SizePage({params}: {params: { sizeId: string}}) {
  
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    });


    return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData={size}/>
        </div>
    </div>
  )
}
