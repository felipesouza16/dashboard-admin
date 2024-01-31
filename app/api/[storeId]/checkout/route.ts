import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type ProductObjectProps = {
  id: string;
  quantity: number;
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productsObjects, successUrl, cancelUrl } = await req.json();

  if (!productsObjects || productsObjects.length === 0) {
    return new NextResponse("Os produtos são obrigatórios.");
  }

  if (!successUrl) {
    return new NextResponse("A url de sucesso do pagamento é obrigatória.");
  }

  if (!cancelUrl) {
    return new NextResponse(
      "A url de cancelamento do pagamento é obrigatória."
    );
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productsObjects.map((prod: ProductObjectProps) => prod.id),
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: productsObjects.find(
        (prod: ProductObjectProps) => prod.id === product.id
      ).quantity,
      price_data: {
        currency: "BRL",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItens: {
        create: productsObjects.map((prod: ProductObjectProps) => ({
          product: {
            connect: {
              id: prod.id,
            },
          },
        })),
      },
    },
  });

  const orderItem = await prismadb.orderItem.findFirst({
    where: {
      orderId: order.id,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      orderId: order.id,
      productsObjects: JSON.stringify(productsObjects),
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
