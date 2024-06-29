"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStoreModal } from '@/hooks/UseStoreModal'
import { Store } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>


interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];

}

export function StoreSwitcher({className, items=[]}: StoreSwitcherProps) {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const[open, setOpen] = useState(false);

    const currentStore = items.find((item) => item.id === params?.storeId);


    function onStoreSelect(store:typeof formattedItems[0]) {
        setOpen(false);
        router.push(`/${store.value}`)
    }


  return (
   <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
       <Button 
       variant={"outline"}
        size={"sm"}
         role={'combobox'}
         aria-expanded={open}
         aria-label='Select a store'
         className={cn("w-[200px] justify-between", className)}>
        <StoreIcon className="w-4 h-4 mr-2"/>
          {currentStore?.name}
        <ChevronsUpDown className="w-4 h-4 ml-auto shrink-0 opacity-50"/>
       </Button>
    </PopoverTrigger>
    <PopoverContent className='w-[200px] p-0'>
        <Command>
            <CommandList>
                <CommandInput placeholder='Search store...' />
                <CommandEmpty>No store found.</CommandEmpty>
                <CommandGroup heading='Stores'>
                    {formattedItems.map((store) => (
                        <CommandItem
                        key={store.value}
                        onSelect={() => onStoreSelect(store)}
                        value={store.value}
                        className='text-sm'>
                            <StoreIcon className="w-4 h-4 mr-2"/>
                            {store.label}
                            <Check className={cn("w-4 h-4 ml-auto",
                                 currentStore?.id === store.value ? "opacity-100" : "opacity-0")}/>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
                <CommandGroup>
                    <CommandItem 
                    onSelect={() => storeModal.onOpen()} className='text-sm'>
                        <PlusCircle className="w-5 h-5 mr-2"/>
                        Create Store
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>

    </PopoverContent>

   </Popover>
  )
}
