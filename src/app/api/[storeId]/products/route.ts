import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {

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

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if(!images || images.length === 0) {
            return new NextResponse("Images is required", { status: 400 });
        }

        if(!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if(!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if(!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        if(!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data:[
                            ...images.map((image:{url: string}) => image),
                            
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("Product_Post: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function GET(request: Request,params: {storeId: string}) {

    try {

        const { userId } = auth();

        const { searchParams } = new URL(request.url);

        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");


        // if (!userId) {
        //     return new NextResponse("Unathenticated", { status: 401 });
        // }   
        console.log(searchParams)

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isFeatured: isFeatured? true: undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log("Product_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}