import prismadb from "@/lib/prismadb";


export async function getTotalSales(storeId: string) {

    const sales = await prismadb.order.count({
        where: {
            storeId: storeId,
            isPaid: true
        }
    });


    return sales;
}