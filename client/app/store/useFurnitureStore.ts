import { create } from 'zustand';
import { nanoid } from 'nanoid';

import ChairModel from '../Models/ChairModel';
import TableModel from '../Models/TableModel';
import SofaModel from '../Models/SofaModel';
import type { Group } from 'three';
import type { ForwardRefComponent, ModelComponentOwnProps } from '../components/FurnitureItem';


export interface CatalogItem {
  id: string;
  name: string;
  imageUrl: string;
  model: ForwardRefComponent<Group, ModelComponentOwnProps>;
  price?: number;
}


export interface PlacedItem {
  instanceId: string;
  catalogId: string;
  model: ForwardRefComponent<Group, ModelComponentOwnProps>;
  position: [number, number, number];
  rotation: [number, number, number];
}

interface FurnitureState {
  available: CatalogItem[];
  placed: PlacedItem[];
  addToRoom: (catalogItem: CatalogItem) => void;
  removeFromRoom: (instanceId: string) => void;
  updateItemTransform: (instanceId: string, newPosition: [number, number, number], newRotation: [number, number, number]) => void;
  clearAll: () => void;
  loadFromSerialized: (data: { placed: Omit<PlacedItem, 'model'>[] }) => void;
  // history
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
}

type HistoryState = { past: PlacedItem[][]; future: PlacedItem[][] };

const initialHistory: HistoryState = { past: [], future: [] };

export const useFurnitureStore = create<FurnitureState & HistoryState>((set, get) => ({
  available: [
    {
      id: 'chair_01',
      name: 'Modern Armchair',
      imageUrl: 'https://www.scandesign.com/cdn/shop/products/1015-VOGUE-armchair-greyblk1_2000x.jpg?v=1653940445',
      model: ChairModel,
      price: 299
    },
    {
      id: 'table_01',
      name: 'Coffee Table',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbadNOIIuj_TDNHX96wEhR7T9ttqcLAksQA&s',
      model: TableModel,
      price: 189
    },
    {
      id: 'Sofa_01',
      name: 'Sofa for sleep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8woq2s31BHbXYY6tc9OCtOvifGnnPZPzd2A&s',
      model: SofaModel,
      price: 799
    }
  ],

  placed: [],
  past: [],
  future: [],

  addToRoom: (catalogItem) =>
    set((state) => ({
      past: [...state.past, state.placed],
      future: [],
      placed: [
        ...state.placed,
        {
          instanceId: nanoid(),
          catalogId: catalogItem.id,
          model: catalogItem.model,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
        },
      ],
    })),

  removeFromRoom: (instanceId) =>
    set((state) => ({
      past: [...state.past, state.placed],
      future: [],
      placed: state.placed.filter((f) => f.instanceId !== instanceId),
    })),

  updateItemTransform: (instanceId, newPosition, newRotation) =>
    set((state) => ({
      past: [...state.past, state.placed],
      future: [],
      placed: state.placed.map(item =>
        item.instanceId === instanceId
          ? { ...item, position: newPosition, rotation: newRotation }
          : item
      )
    })),
  clearAll: () => set((state) => ({ past: [...state.past, state.placed], future: [], placed: [] })),
  loadFromSerialized: (data) => set((state) => ({
    placed: data.placed.map(p => {
      const found = state.available.find(a => a.id === p.catalogId);
      return {
        instanceId: p.instanceId,
        catalogId: p.catalogId,
        model: found ? found.model : state.available[0].model,
        position: p.position,
        rotation: p.rotation,
      };
    })
  })),
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  undo: () => {
    const { past, placed, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({ past: past.slice(0, -1), future: [placed, ...future], placed: previous });
  },
  redo: () => {
    const { past, placed, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ past: [...past, placed], future: future.slice(1), placed: next });
  },
}));