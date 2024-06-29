
import React from 'react'

import {create } from 'zustand'
interface UseStoreModalStore{
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}



export const useStoreModal = create<UseStoreModalStore>(function (set) {
  return {
    isOpen: false,
    onOpen: function () { 
        set({ isOpen: true })
     },
    onClose: function () {
        set({ isOpen: false })
    },
  }
});
