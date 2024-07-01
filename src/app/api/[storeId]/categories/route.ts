import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {

    try {

        const { userId } = auth();
        const { name, billboardId } = await request.json();

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }
        if(!params.storeId){
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const category = await prismadb.category.create({
            data: {
                name: name,
                billboardId: billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("Category_Post: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request: Request,params: {storeId: string}) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }   

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log("Category_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}