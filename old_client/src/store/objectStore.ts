import { create } from "zustand";
import { BaseObject, PlacedObj } from "../types/object";

interface ObjectStore {
  selectedObject: BaseObject | null;
  setSelectedObject: (obj: BaseObject | null) => void;
  placedObjects: PlacedObj[];
  initPlacedObjects: (objects: PlacedObj[] | []) => void;
  addPlacedObject: (object: PlacedObj) => void;
  removePlacedObjectById: (roomObjectId: number) => void;
  movePlacedObject: (
    roomObjectId: number,
    pos: { posX: number; posY: number }
  ) => void;
  clearPlacedObjects: () => void;
}

export const useObjectStore = create<ObjectStore>((set) => ({
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  placedObjects: [],
  initPlacedObjects: (objects) => set({ placedObjects: objects }),
  addPlacedObject: (object) =>
    set((state) => ({
      placedObjects: [...state.placedObjects, object],
    })),
  removePlacedObjectById: (roomObjectId) =>
    set((state) => ({
      placedObjects: state.placedObjects.filter(
        (obj) => obj.roomObjectId !== roomObjectId
      ),
    })),
  movePlacedObject: (roomObjectId, pos) =>
    set((state) => ({
      placedObjects: state.placedObjects.map((obj) =>
        obj.roomObjectId === roomObjectId ? { ...obj, ...pos } : obj
      ),
    })),
  clearPlacedObjects: () => set({ placedObjects: [] }),
}));
