"use client"
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './button';
  

interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}
export function Modal({ title, description, isOpen, onClose, children }: ModalProps) {

    function onChange(open: boolean) {
        if (!open) {
          onClose();
        }
      }
    

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger> */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
