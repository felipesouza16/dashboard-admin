"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";

type OrderClientProps = {
  data: OrderColumn[];
};

export const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Ordens (${data.length})`}
        description="Gerencie as ordens da sua loja."
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
