import { ColorForm } from '@/features/color/ColorForm';
import prismadb from '@/lib/prismadb'
import React from 'react'

export default async function ColorPage({params}: {params: { colorId: string}}) {
  
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    });


    return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ColorForm initialData={color}/>
        </div>
    </div>
  )
}
