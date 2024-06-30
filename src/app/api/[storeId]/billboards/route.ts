import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {

    try {

        const { userId } = auth();
        const { label, imageUrl } = await request.json();

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }
        if(!params.storeId){
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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

        const billboard = await prismadb.billboard.create({
            data: {
                label: label,
                imageUrl: imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("Billboard_Post: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request: Request,params: {storeId: string}) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }   

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log("Billboard_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}