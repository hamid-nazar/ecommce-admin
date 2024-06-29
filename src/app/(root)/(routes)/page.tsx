"use client";

import { Modal } from "@/components/ui/Modal";
import { useStoreModal } from "@/hooks/UseStoreModal";
import { UserButton } from "@clerk/nextjs";
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