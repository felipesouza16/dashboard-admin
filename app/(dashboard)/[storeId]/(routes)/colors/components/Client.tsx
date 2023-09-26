"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

type ColorClientProps = {
  data: ColorColumn[];
};

export const ColorClient = ({ data }: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cores (${data.length})`}
          description="Gerencie as cores para sua loja."
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API para chamar as cores" />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
