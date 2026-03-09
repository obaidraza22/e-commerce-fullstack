import { create } from "zustand";

const useNavModel = create((set) => ({
  openModel: false,
  toggleModel: () =>
    set((state) => ({
      openModel: !state.openModel,
    })),

  closeModel: () => set({ openModel: false }),
}));

export default useNavModel;
