import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { productId: string } }) {

    try {

        if(!params.productId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("Product_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { productId: string, storeId: string } }) {
    try {

        const { userId } = auth();

        const { 
            name, 
            price, 
            images,
            categoryId, 
            sizeId, colorId,
            isFeatured, 
            isArchived } = await request.json();

        const prisma = prismadb;

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

       if(!params.productId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if(!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }

        if(!sizeId) {
            return new NextResponse("Size is required", { status: 400 });
        }

        if(!colorId) {
            return new NextResponse("Color is required", { status: 400 });
        }


        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }


         await prisma.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                images: {
                    deleteMany: {},
                }
            },
        })

        const product = await prisma.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data:[
                            ...images.map((image:{url: string}) => image)
                        ]
                    }
                }
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log("Product_Update: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: {productId: string, storeId: string } }) {
    try {
        const { userId } = auth();
           
        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if(!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.delete({
            where: {
                id: params.productId
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("Product_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}
