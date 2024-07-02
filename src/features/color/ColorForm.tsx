"use client";
import React, { useState } from "react";
import { Color } from "@prisma/client";
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


interface ColorFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  value: z.string().min(1, { message: "Value is required" }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export function ColorForm({ initialData }: ColorFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const title = initialData? "Edit Color" : "Create Color";
    const discription = initialData? "Edit color for your store." : "Add a new color.";
    const toastMessage = initialData? "Color updated." : "Color created.";
    const action = initialData? "Save changes" : "Create";


    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            name: "",
            value: "",
        }
    });

    async function onSubmit(values: ColorFormValues) {
        try {
            setIsLoading(true)
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/colors`);

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
    
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

            router.refresh();
            router.push(`/${params.storeId}/colors`);

            toast.success("Color deleted.")

        } catch (error) {
            toast.error("Make sure you removed all products using this color first.")

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

                            <Input disabled={isLoading} placeholder="Color name" {...field} />

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

                           <div className="flex items-center gap-x-4">
                             <Input disabled={isLoading} placeholder="Color value" {...field} />

                             <div className="h-6 w-6 rounded-full border" style={{backgroundColor: field.value}}/>
                           </div> 

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
