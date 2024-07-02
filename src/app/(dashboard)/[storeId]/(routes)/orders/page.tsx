import { BillboardClient } from "@/features/billboard/BillboardClient";
import { BillboardColumnType } from "@/features/billboard/BillboardColumn";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrderClient } from "@/features/order/OrderClient";
import { OrderColumnType } from "@/features/order/OrderColumn";

export default async function OrdersPage({ params}: { params: { storeId: string }}) {

  const orders = await prismadb.order.findMany({
     where: { 
      storeId: params.storeId 
    }, 
    include: {
      orderItems:{
        include: {
          product: true
        }
      }
    },
    orderBy: {
       createdAt: "desc"
       } 
      });


      const formattedOrders: OrderColumnType[] = orders.map((order) => ({
        id: order.id,
        phone: order.phone,
        address: order.address,
        isPaid: order.isPaid,
        products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
          return total + Number(item.product.price)
        }, 0)),
        createdAt: format(new Date(order.createdAt), "MMMM do, yyyy"),
      }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
}
