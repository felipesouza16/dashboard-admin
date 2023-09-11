"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/StoreModal";

//como o componente é renderizado no lado do client, pode ser que haja uma dessincronização
//entre o server-side e o client-side, esse provider garante que
//o modal só será chamado assim que a aplicação estiver montada.

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
