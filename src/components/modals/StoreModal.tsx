'use client'
import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { Modal } from '@/components/ui/Modal'
import { useStoreModal } from '@/hooks/UseStoreModal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { redirect, useRouter } from 'next/navigation'


const storeFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
})


export function StoreModal() {
    const { isOpen, onClose } = useStoreModal();

    const [isLoading, setIsLoading] = React.useState(false)

    const router = useRouter();

    const form  = useForm<z.infer<typeof storeFormSchema>>({
        resolver: zodResolver(storeFormSchema),
        defaultValues: {
            name: '',
        }
    })

   async function onSubmit(values: z.infer<typeof storeFormSchema>) {
        try {
            setIsLoading(true)
           
            const response = await axios.post('/api/stores', values)

            window.location.assign(`/${response.data.id}`)
           form.reset()

    } catch (error: any) {

        toast.error("Something went wrong")

    } finally {
        setIsLoading(false)
        onClose()
    }

}


  return (
    <Modal
      title="Create store"
      description="Add a new store to manage your products and cotegories"
      isOpen={isOpen}
      onClose={onClose}>
   <div>
       <div className='space-y-4 py-2 pb-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={function({field}) {
                            return <FormItem>

                                <FormLabel>Name</FormLabel>

                                <FormControl>
                                    <Input placeholder='E-commerce' {...field} disabled={isLoading} />
                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        }}/>
                        <div className='pt-6 space-x-2 flex items-center justify-end'>
                            <Button variant="outline" onClick={onClose} disabled={isLoading} >
                                Cancel
                            </Button>
                            <Button variant="default" type='submit' disabled={isLoading} >
                                Continue
                            </Button>
                        </div>
                </form>
            </Form>
      </div>
   </div>

    </Modal>
  )
}
