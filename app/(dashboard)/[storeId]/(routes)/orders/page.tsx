import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import pt from "date-fns/locale/pt-BR";

import { OrderClient } from "./components/Client";
import { OrderColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItens: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItens
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItens.reduce((acc, value) => {
        return acc + value.product.price;
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "dd 'de' MMMM', 'yyyy'", {
      locale: pt,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
