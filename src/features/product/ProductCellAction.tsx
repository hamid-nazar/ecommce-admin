"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/AlertModal";
import { ProductColumnType } from "@/features/product/ProductColumn";

interface ProudctCellActionProps {
  data: ProductColumnType;
}

export function ProductCellAction({ data }: ProudctCellActionProps) {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function onCopy(id: string) {
    navigator.clipboard.writeText(id);
    toast.success("Product Id copied to clipboard!");
  }

  async function onDelete() {
    try {
      setIsLoading(true);
    
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);

      router.refresh();
    //   router.push(`/${params.storeId}/billboards`);

      toast.success("Product deleted.");

    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}/>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center justify-center">
            Actions
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
