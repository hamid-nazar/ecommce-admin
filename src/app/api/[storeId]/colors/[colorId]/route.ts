import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { colorId: string } }) {

    try {

        const { userId } = auth();

        if (!userId) {  
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color); 

    } catch (error) {
        console.log("Color_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });

    }
}

export async function PATCH(request: Request, { params }: { params: { colorId: string, storeId: string } }) {
    try {
        const { userId } = auth();
        const { name, value } = await request.json();
        const prisma = prismadb;


        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await prisma.color.update({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("Color_Patch: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: {colorId: string, storeId: string } }) {
    try {
        const { userId } = auth();
           
        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await prismadb.color.delete({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color); 

    } catch (error) {
        console.log("Color_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
