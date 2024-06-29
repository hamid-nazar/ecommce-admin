"use client";
import React, { useState } from "react";
import { Store } from "@prisma/client";
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
import { useRouter } from "next/navigation";
import { AlertModal } from "./modals/AlertModal";


interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export function SettingsForm({ initialData }: SettingsFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData
    });

    async function onSubmit(values: SettingsFormValues) {
        try {
            setIsLoading(true)
            
            await axios.patch(`/api/stores/${initialData.id}`, values);

            router.refresh();

            toast.success("Store updated")

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
    
            await axios.delete(`/api/stores/${initialData.id}`);

            router.refresh();
            router.push("/");

            toast.success("Store deleted.")

        } catch (error) {
            toast.error("Make sure you removed all products and cotegories first.")

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
        <Heading title="Settings" description="Manage store preferences" />
        <Button 
        disabled={isLoading}
        variant={"destructive"} 
        size={"icon"} 
        onClick={() => setOpen(true)}>

          <Trash className="h-4 w-4" />

        </Button>
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

                            <Input disabled={isLoading} placeholder="Store name" {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>

            </div>

            <Button 
            disabled={isLoading}
            type="submit"
            className="ml-auto">
                Save changes
            </Button>

        </form>
      </Form>
    </>
  );
}
