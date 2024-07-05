import Stripe from "stripe";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";;
import { NextResponse } from "next/server";




export async function POST(request: Request) {
 
        const body = await request.text();
   

        const signature = headers().get('stripe-signature') as string;


        let event: Stripe.Event;

        try {
           
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

        } catch (error: any) {

            console.log("Error: ", error.message);

            return new NextResponse("Webhook Error:", error.message);
        }

        const session = event.data.object as Stripe.Checkout.Session;

        const address = session.customer_details?.address;

        const completeAddress = [
            address?.line1,
            address?.line2,
            address?.city,
            address?.state,
            address?.postal_code,
            address?.country,
          ].filter(Boolean).join(", ");
        
        console.log("Complete Address: ", completeAddress);


        if (event.type === "checkout.session.completed") {

            const order  = await prismadb.order.update({
                where: {
                    id: session?.metadata?.orderId
                },
                data: {
                    isPaid: true,
                    address: completeAddress || "N/A",
                    phone: session?.customer_details?.phone || "N/A"
                },
                include: {
                    orderItems: true
                }
            });

            const productIds = order.orderItems.map((item) => item.productId);

            const products = await prismadb.product.findMany({
                where: {
                    id: {
                        in: [...productIds]
                    }
                }
            });
            
        }


        return new NextResponse(null, { status: 200 });
   
}