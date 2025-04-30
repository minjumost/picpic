// src/store/objectStore.ts
import { create } from "zustand";
import { ServerObject, PlacedObject } from "../types/object";

interface ObjectStore {
  // 선택된 오브젝트 관리
  selectedObject: ServerObject | null;
  setSelectedObject: (obj: ServerObject | null) => void;

  // 배치된 오브젝트 관리
  placedObjects: PlacedObject[];
  initPlacedObjects: (objects: PlacedObject[]) => void;
  addPlacedObject: (object: PlacedObject) => void;
  removePlacedObject: (objectId: number, posX: number, posY: number) => void;
  clearPlacedObjects: () => void;
}

export const useObjectStore = create<ObjectStore>((set) => ({
  // 선택된 오브젝트 관리
  selectedObject: null,
  initPlacedObjects: (objects) => set({ placedObjects: objects }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // 배치된 오브젝트 관리
  placedObjects: [],
  addPlacedObject: (object) =>
    set((state) => ({
      placedObjects: [...state.placedObjects, object],
    })),
  removePlacedObject: (objectId, posX, posY) =>
    set((state) => ({
      placedObjects: state.placedObjects.filter(
        (obj) =>
          // id가 다르거나 OR 위치가 다른 오브젝트만 남김
          obj.id !== objectId || obj.posX !== posX || obj.posY !== posY
      ),
    })),
  clearPlacedObjects: () => set({ placedObjects: [] }),
}));
