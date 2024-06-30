"use client";
import React, { useState } from "react";
import { Billboard } from "@prisma/client";
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
import { AlertModal } from "./modals/AlertModal";
import { useOrigin } from "@/hooks/useOrigin";
import { ImageUpload } from "./ui/ImageUpload";


interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export function BillboardForm({ initialData }: BillboardFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const title = initialData? "Edit Billboard" : "Create Billboard";
    const discription = initialData? "Edit billboard for your store." : "Add a new billboard.";
    const toastMessage = initialData? "Billboard updated." : "Billboard created.";
    const action = initialData? "Save changes" : "Create";


    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            label: '',
            imageUrl: ''
        }
    });

    async function onSubmit(values: BillboardFormValues) {
        try {
            setIsLoading(true)
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/billboards`);

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
    
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

            router.refresh();
            router.push(`/${params.storeId}/billboards`);

            toast.success("Billboard deleted.")

        } catch (error) {
            toast.error("Make sure you removed all cotegories using this billboard first.")

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

        <FormField 
                control={form.control} 
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Background Image</FormLabel>

                        <FormControl>

                            <ImageUpload 
                            disabled={isLoading}
                            values={field.value? [field.value] : []}
                            onChange={(url)=>field.onChange(url)}
                            onRemove={(url)=>field.onChange("")}
                            />
                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}
            />

            <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control} 
                name="label"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Label</FormLabel>

                        <FormControl>

                            <Input disabled={isLoading} placeholder="Billboard label" {...field} />

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
