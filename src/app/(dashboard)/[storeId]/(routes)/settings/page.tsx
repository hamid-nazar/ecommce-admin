import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


import { SettingsForm } from '@/features/setting/SettingsForm';
import prismadb from '@/lib/prismadb';

export default async function SettingsPage({params}: {params: {storeId: string}}) {

    const {userId} = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    })
 
    if(!store){
        redirect('/');
    }
    

  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SettingsForm initialData={store}/>
        </div>
    </div>
  )
}
