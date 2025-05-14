import { create } from "zustand";

interface StompStatusState {
  isConnected: boolean;
  setConnected: (status: boolean) => void;
}

export const useStompStatusStore = create<StompStatusState>((set) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
}));
