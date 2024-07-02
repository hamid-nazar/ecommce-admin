import { ColorClient } from "@/features/color/ColorClient";
import { ColorColumnType } from "@/features/color/ColorColumn";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";

export default async function colorsPage({ params}: { params: { storeId: string }}) {

  const colors = await prismadb.color.findMany({
     where: { 
      storeId: params.storeId 
    }, 
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedColors: ColorColumnType[] = colors.map((color) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        createdAt: format(new Date(color.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
}
