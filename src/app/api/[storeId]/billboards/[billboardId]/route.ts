import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { billboardId: string } }) {

    try {

        if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("Billboard_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { billboardId: string, storeId: string } }) {
    try {
        const { userId } = auth();
        const { label, imageUrl } = await request.json();
        const prisma = prismadb;

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

       if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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


        const billboard = await prisma.billboard.update({
            where: {
                id: params.billboardId,
                storeId: params.storeId
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("Billboard_Update: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: {billboardId: string, storeId: string } }) {
    try {
        const { userId } = auth();
           
        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const billboard = await prismadb.billboard.delete({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("Billboard_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}
