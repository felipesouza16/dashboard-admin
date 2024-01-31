"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./Columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/AlertModal";

type CellActionsProps = {
  data: ProductColumn;
};

export const CellAction = ({ data }: CellActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Id do produto copiado.");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      router.refresh();
      toast.success("Produto deletado.");
    } catch (error) {
      toast.error("Algo está errado.");
    } finally {
      setLoading(false);
      setOpen(false);
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setTimeout(() => {
            document.body.style.pointerEvents = "";
          }, 500);
        }}
        loading={loading}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Atualizar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
