'use client'

import React,{useState,useEffect, use} from 'react';

import { StoreModal } from '@/components/modals/StoreModal';
import { AlertModal } from '@/components/modals/AlertModal';

export function ModalProvider() {
    const[isMounted,setIsMounted] = useState(false)

    useEffect(function(){
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

  return (
    <>
    <StoreModal />
    </>
  )
}
