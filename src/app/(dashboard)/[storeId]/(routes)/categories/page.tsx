import { CategoryClient } from "@/features/category/CategoryClient";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { CategoryColumnType } from "@/features/category/CategoryColumn";

export default async function CategoriesPage({ params}: { params: { storeId: string }}) {

  const categories = await prismadb.category.findMany({
     where: { 
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedCategories: CategoryColumnType[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(new Date(category.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
