import { create } from "zustand";

type useModalStoreProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

//zustand é um gerenciador de estado rápido e escalonável
export const useModalStore = create<useModalStoreProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
