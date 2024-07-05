
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST,PATCH, DELETE, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {

    return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(request: Request, { params }: { params: { storeId: string } }) {

    try {
        const {productIds} = await request.json();

        if(!productIds || productIds.length === 0) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        products.forEach(function (product) {

            line_items.push({
                quantity: 1,
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name
                    },
                    unit_amount: product.price.toNumber() * 100,
                },
            });
        });

        const order = await prismadb.order.create({
            data: {
                phone: "",
                address: "",
                isPaid: false,
                storeId: params.storeId,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                },
            }
        });

        const success_url = `http://localhost:3001/cart?success=1`;
        const cancel_url = `http://localhost:3001/cart?canceled=1`;

        
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url:success_url,
            cancel_url: cancel_url,
            line_items: line_items,
            billing_address_collection: "required",
            phone_number_collection: { enabled: true },
            metadata: {
                orderId: order.id
            }
        });


        return NextResponse.json({url: session.url}, { headers: corsHeaders });

    } catch (error: any) {

        console.log("Checkout_Post: ", error.message) ;

        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}