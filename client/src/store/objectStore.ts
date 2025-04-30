// src/store/objectStore.ts
import { create } from "zustand";
import { ServerObject } from "../types/object";

interface ObjectStore {
  selectedObject: ServerObject | null;
  setSelectedObject: (obj: ServerObject | null) => void;
}

export const useObjectStore = create<ObjectStore>((set) => ({
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));
