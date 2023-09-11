"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModalStore } from "@/hooks/useModalStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//zod é uma lib de validação de formulários
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome deve conter ao menos 1 caractere." }),
});

export const StoreModal = () => {
  const { isOpen, onClose } = useModalStore();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", data);

      // por que usar window.location.assign ao invés de navigate?
      // para evitar uma dessincronização com o banco, pois o window.location.assign
      // da um refresh na pagina limpando assim todos os estados da aplicação.
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Algo está errado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Criar uma nova loja"
      description="Crie uma nova loja para gerenciar produtos e categorias."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nome da loja"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
