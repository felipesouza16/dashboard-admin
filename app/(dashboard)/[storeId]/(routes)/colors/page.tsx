import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import pt from "date-fns/locale/pt-BR";

import { ColorClient } from "./components/Client";
import { ColorColumn } from "./components/Columns";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: {
      id: params.colorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd 'de' MMMM', 'yyyy'", {
      locale: pt,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorPage;
