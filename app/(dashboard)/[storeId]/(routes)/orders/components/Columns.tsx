"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produtos",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: () => <div className="text-center">Pago</div>,
    cell: ({ row }) =>
      row.original.isPaid ? (
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
    accessorKey: "createdAt",
    header: "Data",
  },
];
