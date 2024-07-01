import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { sizeId: string } }) {

    try {

        const { userId } = auth();

        if (!userId) {  
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.sizeId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size); 

    } catch (error) {
        console.log("Size_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });

    }
}

export async function PATCH(request: Request, { params }: { params: { sizeId: string, storeId: string } }) {
    try {
        const { userId } = auth();
        const { name, value } = await request.json();
        const prisma = prismadb;


        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.sizeId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!value) {
            return new NextResponse("Value is required", { status: 400 });
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

        const size = await prisma.size.update({
            where: {
                id: params.sizeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("Size_Patch: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: {sizeId: string, storeId: string } }) {
    try {
        const { userId } = auth();
           
        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.sizeId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
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

        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size); 

    } catch (error) {
        console.log("Size_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
