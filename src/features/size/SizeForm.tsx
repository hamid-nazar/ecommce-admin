"use client";
import React, { useState } from "react";
import { Size } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";


import { Trash } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "../../components/modals/AlertModal";
import { useOrigin } from "@/hooks/useOrigin";
import { ImageUpload } from "../../components/ui/ImageUpload";


interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  value: z.string().min(1, { message: "Value is required" }),
});

type SizeFormValues = z.infer<typeof formSchema>;

export function SizeForm({ initialData }: SizeFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const title = initialData? "Edit Size" : "Create Size";
    const discription = initialData? "Edit size for your store." : "Add a new size.";
    const toastMessage = initialData? "Size updated." : "Size created.";
    const action = initialData? "Save changes" : "Create";


    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            name: "",
            value: "",
        }
    });

    async function onSubmit(values: SizeFormValues) {
        try {
            setIsLoading(true)
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/sizes`);

            toast.success(toastMessage)

        } catch (error) {

            toast.error("Something went wrong")

        } finally {
            setIsLoading(false)
            
        }
    }

    async function onDelete() {
        try {
            setIsLoading(true)
            setOpen(true)
    
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

            router.refresh();
            router.push(`/${params.storeId}/sizes`);

            toast.success("Size deleted.")

        } catch (error) {
            toast.error("Make sure you removed all products using this size first.")

        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }



  return (
    <>
      <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)} 
      onConfirm={onDelete} 
      loading={isLoading}/>
      
      <div className="flex items-center justify-between">
        <Heading title={title} description={discription}/>
        { initialData && (
              <Button 
              disabled={isLoading}
              variant={"destructive"} 
              size={"icon"} 
              onClick={() => setOpen(true)}>
      
                <Trash className="h-4 w-4" />
      
              </Button>
            )
        }
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

            <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control} 
                name="name"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Name</FormLabel>

                        <FormControl>

                            <Input disabled={isLoading} placeholder="Size name" {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>

                <FormField 
                control={form.control} 
                name="value"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Value</FormLabel>

                        <FormControl>

                            <Input disabled={isLoading} placeholder="Size value" {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>

            </div>

            <Button 
            disabled={isLoading}
            type="submit"
            className="ml-auto">
                {action}
            </Button>

        </form>
      </Form>

    </>
  );
}
