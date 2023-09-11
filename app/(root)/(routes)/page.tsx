"use client";

import { useModalStore } from "@/hooks/useModalStore";
import { useEffect } from "react";

const InitialPage = () => {
  const { onOpen, isOpen } = useModalStore();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return null;
};

export default InitialPage;
