import { create } from "zustand";

interface FrameState {
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
}

export const useFrameStore = create<FrameState>((set) => ({
  selectedFrame: "",
  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
}));
