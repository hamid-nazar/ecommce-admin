"use client";

import { useStoreModal } from "@/hooks/UseStoreModal";
import { useEffect } from "react";

export default function SetupPage() {
  const { isOpen, onOpen, onClose } = useStoreModal();

  useEffect(function(){
    if(!isOpen){
        onOpen()
    }
  },[ isOpen, onOpen])


  return null;
}