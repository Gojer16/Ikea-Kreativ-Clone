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
}

export const useFurnitureStore = create<FurnitureState>((set) => ({
  available: [
    {
      id: 'chair_01',
      name: 'Modern Armchair',
      imageUrl: 'https://www.scandesign.com/cdn/shop/products/1015-VOGUE-armchair-greyblk1_2000x.jpg?v=1653940445',
      model: ChairModel
    },
    {
      id: 'table_01',
      name: 'Coffee Table',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbadNOIIuj_TDNHX96wEhR7T9ttqcLAksQA&s',
      model: TableModel
    },
    {
      id: 'Sofa_01',
      name: 'Sofa for sleep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8woq2s31BHbXYY6tc9OCtOvifGnnPZPzd2A&s',
      model: SofaModel
    }
  ],

  placed: [],

  addToRoom: (catalogItem) =>
    set((state) => ({
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
      placed: state.placed.filter((f) => f.instanceId !== instanceId),
    })),

  updateItemTransform: (instanceId, newPosition, newRotation) =>
    set((state) => ({
      placed: state.placed.map(item =>
        item.instanceId === instanceId
          ? { ...item, position: newPosition, rotation: newRotation }
          : item
      )
    })),
}));