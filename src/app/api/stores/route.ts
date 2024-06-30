import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const { name } = await request.json();
        const prisma = prismadb;

        if (!userId) {
            return new NextResponse("Unathenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }


        const store = await prisma.store.create({
            data: {
                name: name,
                userId: userId
            }
        });

        return NextResponse.json(store);


    } catch (error) {
        console.log("Store_Post: ", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}



  