import React, { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';


interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading}: AlertModalProps) {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(function(){
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }


  return (
    <Modal
    title='Are you sure?'
    description='This action cannot be undone.'
    isOpen={isOpen}
    onClose={onClose}>
        <div className='pt-6 space-x-2 flex items-center justify-center w-full'>
            <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}>
                Cancel
            </Button>
            <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={loading}>
                Continue
            </Button>
        </div>

    </Modal>
  )
}
