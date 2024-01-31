import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

type ProductObjectProps = {
  id: string;
  quantity: number;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const productsObjects: ProductObjectProps[] = JSON.parse(
    String(session?.metadata?.productsObjects)
  );
  const addressString = addressComponents.filter((c) => c !== null).join(", ");
  try {
    productsObjects.forEach(async ({ id, quantity }) => {
      const prod = await prismadb.product.findFirst({
        where: {
          id: id,
        },
      });
      const decrementResult = Number(prod?.quantity) - quantity;
      if (decrementResult < 0) {
        return new NextResponse(
          "Webhook error: Quantidade solicitada maior do que estoque."
        );
      }
      await prismadb.product.updateMany({
        where: {
          id: id,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    });
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItens: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
