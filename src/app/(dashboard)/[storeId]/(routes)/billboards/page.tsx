import { BillboardClient } from "@/features/billboard/BillboardClient";
import { BillboardColumnType } from "@/features/billboard/BillboardColumn";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";

export default async function BillboardsPage({ params}: { params: { storeId: string }}) {

  const billboards = await prismadb.billboard.findMany({
     where: { 
      storeId: params.storeId 
    }, 
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedBillboards: BillboardColumnType[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        createdAt: format(new Date(billboard.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
