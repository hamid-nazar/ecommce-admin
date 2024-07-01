import { SizeClient } from "@/features/size/SizeClient";
import { SizeColumnType } from "@/features/size/SizeColumn";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";

export default async function SizesPage({ params}: { params: { storeId: string }}) {

  const sizes = await prismadb.size.findMany({
     where: { 
      storeId: params.storeId 
    }, 
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedSizes: SizeColumnType[] = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(new Date(size.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
}
