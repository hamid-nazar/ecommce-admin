import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { MainNav } from '@/features/navigation/MainNav'
import { StoreSwitcher } from '@/components/ui/StoreSwitcher'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

export async function Navbar() {

    const {userId} = auth();
    if(!userId){
        redirect('/sign-in');
    }
    const stores = await prismadb.store.findMany({
        where: {
            userId: userId
        }
    });

  return (
    <div className='border-b'>
        <div className='flex items-center h-16 px-4'>
            <StoreSwitcher items={stores} />
            <MainNav className='mx-6' />
            <div className='ml-auto flex itcems-center space-x-4'>
                <UserButton afterSignOutUrl="/" />

            </div>

        </div>

    </div>
  )
}
