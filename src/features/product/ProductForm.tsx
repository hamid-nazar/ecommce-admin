"use client";
import React, { useState } from "react";
import { Product,Image, Category, Size, Color } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";


import { Trash } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/AlertModal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface ProductFormProps {
  initialData: Product & { images: Image[]} | null;
  categories: Category[] | null;
  sizes: Size[] | null;
  colors: Color[] | null;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1, { message: "Price is required" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    colorId: z.string().min(1, { message: "Color is required" }),
    sizeId: z.string().min(1, { message: "Size is required" }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm({ initialData, categories, sizes, colors }: ProductFormProps) {
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const title = initialData? "Edit Product" : "Create Product";
    const discription = initialData? "Edit product for your store." : "Add a new Product.";
    const toastMessage = initialData? "Product updated." : "Product created.";
    const action = initialData? "Save changes" : "Create";


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData? {
            ...initialData,
            price: parseFloat(String(initialData.price)), 
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        }
    });

    async function onSubmit(values: ProductFormValues) {
        console.log(values)
        try {
            setIsLoading(true)
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/products`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/products`);

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
    
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

            router.refresh();
            router.push(`/${params.storeId}/products`);

            toast.success("Product deleted.")

        } catch (error) {
            toast.error("Something went wrong.")

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
                name="images"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Images</FormLabel>

                        <FormControl>

                            <ImageUpload 
                            disabled={isLoading}
                            values={field.value.map((image)=>image.url)}
                            onChange={(url)=>field.onChange([...field.value, {url: url}])}
                            onRemove={(url)=>field.onChange([...field.value.filter((image)=>image.url !== url)])}
                            />
                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}
            />

            <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control} 
                name="name"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Name</FormLabel>

                        <FormControl>

                            <Input disabled={isLoading} placeholder="Product name" {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>

                <FormField 
                control={form.control} 
                name="price"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>Price</FormLabel>

                        <FormControl>

                            <Input 
                            type="number" 
                            disabled={isLoading} 
                            placeholder="9.99" 
                            {...field} />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}/>

                <FormField 
                control={form.control} 
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>

                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}>

                        <FormControl>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>

                            <SelectContent>
                            {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                {category.name}
                                </SelectItem>
                            ))}
                            </SelectContent>

                        </Select>

                        <FormMessage />

                    </FormItem>
                )}/>       
                 <FormField 
                control={form.control} 
                name="sizeId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Size</FormLabel>

                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}>

                        <FormControl>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a size" />
                            </SelectTrigger>
                        </FormControl>

                            <SelectContent>
                            {sizes?.map((size) => (
                                <SelectItem key={size.id} value={size.id}>
                                {size.name}
                                </SelectItem>
                            ))}
                            </SelectContent>

                        </Select>

                        <FormMessage />

                    </FormItem>
                )}/>        

                <FormField 
                control={form.control} 
                name="colorId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Color</FormLabel>

                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}>

                        <FormControl>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a color" />
                            </SelectTrigger>
                        </FormControl>

                            <SelectContent>
                            {colors?.map((color) => (
                                <SelectItem key={color.id} value={color.id}>
                                {color.name}
                                </SelectItem>
                            ))}
                            </SelectContent>

                        </Select>

                        <FormMessage />

                    </FormItem>
                )}/> 

                <FormField 
                control={form.control} 
                name="isFeatured"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">

                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>
                                This product will appear on the home page. 
                            </FormDescription>
                        </div>

                    </FormItem>
                )}/>           

                <FormField 
                control={form.control} 
                name="isArchived"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">

                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Archived</FormLabel>
                            <FormDescription>
                                This product will not appear anywhere in the store.
                            </FormDescription>
                        </div>

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
