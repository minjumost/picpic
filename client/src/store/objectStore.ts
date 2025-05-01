import { create } from "zustand";
import { ServerObject, PlacedObject } from "../types/object";

interface ObjectStore {
  selectedObject: ServerObject | null;
  setSelectedObject: (obj: ServerObject | null) => void;
  placedObjects: PlacedObject[];
  initPlacedObjects: (objects: PlacedObject[]) => void;
  addPlacedObject: (object: PlacedObject) => void;
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
        (obj) => obj.id !== roomObjectId
      ),
    })),
  movePlacedObject: (roomObjectId, pos) =>
    set((state) => ({
      placedObjects: state.placedObjects.map((obj) =>
        obj.id === roomObjectId ? { ...obj, ...pos } : obj
      ),
    })),
  clearPlacedObjects: () => set({ placedObjects: [] }),
}));
