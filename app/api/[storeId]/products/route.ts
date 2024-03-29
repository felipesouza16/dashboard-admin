import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      quantity,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Não autenticado.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("O nome é obrigatório.", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("As imagens são obrigatórias.", { status: 400 });
    }

    if (!price) {
      return new NextResponse("O preço é obrigatório.", { status: 400 });
    }

    if (!quantity) {
      return new NextResponse("A quantidade é obrigatória.", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("A categoria é obrigatória.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("A cor é obrigatória.", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("O tamanho é obrigatório.", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("O Id da loja é obrigatório.", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado.", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        quantity,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Erro interno.", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    if (!params.storeId) {
      return new NextResponse("O Id da loja é obrigatório.", { status: 400 });
    }

    const product = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        images: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Erro interno.", { status: 500 });
  }
}
