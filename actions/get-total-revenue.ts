import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItens: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((acc, value) => {
    const orderTotal = value.orderItens.reduce((accOrder, valueOrder) => {
      return accOrder + valueOrder.product.price;
    }, 0);

    return acc + orderTotal;
  }, 0);

  return totalRevenue;
};
