"use client";
import React, { useState } from "react";
import { Billboard, Category } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";


import { Trash } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select";



interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  billboardId: z.string().min(1, { message: "Billboard ID is required" }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export function CategoryForm({ initialData, billboards=[] }: CategoryFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const title = initialData? "Edit Category" : "Create Category";
    const discription = initialData? "Edit category for your store." : "Add a new category.";
    const toastMessage = initialData? "Category updated." : "Category created.";
    const action = initialData? "Save changes" : "Create";


    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            name: '',
            billboardId: '',
        }
    });

    async function onSubmit(values: CategoryFormValues) {
        try {
            setIsLoading(true)
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, values);
            }

            router.refresh();
            // router.push(`/${params.storeId}/categories`);
            window.location.assign(`/${params.storeId}/categories`);
         
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
    
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);

            router.refresh();
            router.push(`/${params.storeId}/categories`);

            toast.success("Category deleted.")

        } catch (error) {
            toast.error("Make sure you removed all products using this cotegories first.")

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

                            <Input disabled={isLoading} placeholder="Category name" {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>


                <FormField 
                control={form.control} 
                name="billboardId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Billboard</FormLabel>

                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}>

                        <FormControl>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a billboard" />
                            </SelectTrigger>
                        </FormControl>

                            <SelectContent>
                            {billboards.map((billboard) => (
                                <SelectItem key={billboard.id} value={billboard.id}>
                                {billboard.label}
                                </SelectItem>
                            ))}
                            </SelectContent>

                        </Select>

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
