import { create } from "zustand";

const useModelStore = create((set) => ({
  isModelOpen: false,
  toggleModel: () =>
    set((state) => ({
      isModelOpen: !state.isModelOpen,
    })),
}));

export default useModelStore;
