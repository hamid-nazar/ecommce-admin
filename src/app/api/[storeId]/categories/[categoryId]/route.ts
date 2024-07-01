import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { categoryId: string } }) {

    try {

        if(!params.categoryId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const category = await prismadb.billboard.findUnique({
            where: {
                id: params.categoryId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("Category_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { categoryId: string, storeId: string } }) {
    try {
        const { userId } = auth();
        const { name, billboardId } = await request.json();
        const prisma = prismadb;

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

       if(!params.categoryId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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


        const category = await prisma.category.update({
            where: {
                id: params.categoryId
            },
            data: {
                name: name,
                billboardId: billboardId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log("Category_Update: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: {categoryId: string, storeId: string } }) {
    try {
        const { userId } = auth();
           
        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if(!params.categoryId) {
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

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log("Category_Delete: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}
