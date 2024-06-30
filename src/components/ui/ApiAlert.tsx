"use client"

import React from 'react';
import { Copy, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';


interface ApiAlertProps {
    title: string;
    description: string;
    variant:"public" | "admin";
}

const TextMap:Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
}

const variantMap:Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
}


export function ApiAlert({title,description,variant="public"}: ApiAlertProps) {

    function onCopy() {
        navigator.clipboard.writeText(description);
        toast.success("API route copied to clipboard!")
    }

  return (
    <Alert>
        <Server className="w-4 h-4"/>
        <AlertTitle className='flex items-center gap-x-2'>
            {title}
        <Badge variant={variantMap[variant]}>
            {TextMap[variant]}
        </Badge>
        </AlertTitle>
        <AlertDescription className='mt-4 flex items-center justify-between'>
            <code className='relative rounded bg-muted text-sm font-mono font-semibold px-[.3rem] py-[.2rem]'>
                {description}
            </code>
            <Button variant="outline" size={"icon"} onClick={onCopy}>
                <Copy className="w-4 h-4"/>
            </Button>
        </AlertDescription>
        
    </Alert>
  )
}
