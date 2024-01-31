"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Check, X } from "lucide-react";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  quantity: number;
  color: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "isFeatured",
    header: () => <div className="text-center">Destaque</div>,
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <div className="flex justify-center">
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <div className="flex justify-center">
          <X className="h-4 w-4" />
        </div>
      ),
  },
  {
    accessorKey: "isArchived",
    header: () => <div className="text-center">Arquivado</div>,
    cell: ({ row }) =>
      row.original.isArchived ? (
        <div className="flex justify-center">
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <div className="flex justify-center">
          <X className="h-4 w-4" />
        </div>
      ),
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "size",
    header: "Tamanho",
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Data",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
