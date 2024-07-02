import { ProductColumnType } from "@/features/product/ProductColumn";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { ProductClient } from "@/features/product/ProductClient";

export default async function ProductsPage({ params}: { params: { storeId: string }}) {

  const products = await prismadb.product.findMany({
     where: { 
      storeId: params.storeId 
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedProducts: ProductColumnType[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        price: formatter.format(product.price.toNumber()),
        category: product.category.name,
        size: product.size.name,
        color: product.color.value,
        createdAt: format(new Date(product.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
