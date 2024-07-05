import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {

    try {

        const { userId } = auth();
        const { name, value } = await request.json();

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }
        if(!params.storeId){
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!value) {
            return new NextResponse("Value is required", { status: 400 });
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

        const size = await prismadb.size.create({
            data: {
                name: name,
                value: value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("Size_Post: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function GET(request: Request,params: {storeId: string}) {

    try {

        const { userId } = auth();

        // if (!userId) {
        //     return new NextResponse("Unathenticated", { status: 401 });
        // }   

     

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(sizes);

    } catch (error) {
        console.log("Size_Get: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}