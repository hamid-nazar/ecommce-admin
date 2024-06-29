import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const { name } = await request.json();
        const prisma = prismadb;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const store = await prisma.store.update({
            where: {
                id: params.storeId,
                userId: userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log("Store_Patch: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const prisma = prismadb;    

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const store = await prisma.store.delete({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log("Store_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
