import prismadb from "@/lib/prismadb";
import { OrderItem } from "@prisma/client";


export async function getTotalRevenue(storeId: string) {

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId: storeId,
            isPaid: true
        },
        include: {
            orderItems:{
                include: {
                    product: true
                }
            }
            
        }
    });

    const totalRevenue = paidOrders.reduce(function (total: number, order) {
        
        const totalOrder = order.orderItems.reduce(function (orderSum: number, item) {

            return orderSum + Number(item.product.price);

        }, 0);
      

        return total + totalOrder;

    }, 0);


    return totalRevenue;
}