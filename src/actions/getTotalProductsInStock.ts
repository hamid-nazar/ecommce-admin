import prismadb from "@/lib/prismadb";


export async function getTotalProductsInStock(storeId: string) {

    const tolalProductsInStock = await prismadb.product.count({
        where: {
            storeId: storeId,
            isArchived: false
        }
    });


    return tolalProductsInStock;
}