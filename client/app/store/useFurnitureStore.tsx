import { create } from 'zustand';
import { nanoid } from 'nanoid'; 
import ChairModel from '../Models/ChairModel'; 
import TableModel from '../Models/TableModel'; 

// Interface for items in the visual selector/catalog
export interface CatalogItem {
  id: string;          // Product ID (e.g., 'ikea-strandmon')
  name: string;
  imageUrl: string;
  model: React.FC;     // The 3D model component
}

// Interface for items that have been placed in the 3D room
export interface PlacedItem {
  instanceId: string;  // A unique ID for this specific instance (e.g., 'chair_abc123')
  catalogId: string;   // The ID of the item from the catalog
  position: [number, number, number];
  model: React.FC;
}

interface FurnitureState {
  available: CatalogItem[];    // This is now our product catalog
  placed: PlacedItem[];
  addToRoom: (catalogItem: CatalogItem) => void;
  removeFromRoom: (instanceId: string) => void;
  updatePosition: (instanceId: string, newPosition: [number, number, number]) => void;
}

export const useFurnitureStore = create<FurnitureState>((set) => ({
  // AVAILABLE: This is your product catalog. It contains all info needed to display and add items.
  available: [
    { 
      id: 'chair_01', 
      name: 'Modern Armchair',
      // Using a placeholder image service is great for prototyping!
      imageUrl: 'https://www.scandesign.com/cdn/shop/products/1015-VOGUE-armchair-greyblk1_2000x.jpg?v=1653940445', 
      model: ChairModel 
    },
    { 
      id: 'table_01', 
      name: 'Coffee Table',
      imageUrl: 'https://placehold.co/150x150/f0f0f0/333?text=Table',
      model: TableModel 
    },
  ],

  // PLACED: This array holds the unique instances of furniture in the room.
  placed: [],

  // addToRoom now takes a CatalogItem from the selector...
  addToRoom: (catalogItem) =>
    set((state) => ({
      // ...and creates a new PlacedItem from it.
      placed: [
        ...state.placed,
        {
          instanceId: nanoid(), // Generate a unique ID for this specific chair
          catalogId: catalogItem.id,
          model: catalogItem.model,
          position: [0, 0, 0], // Always add at a default position
        },
      ],
    })),

  // removeFromRoom now uses the unique instanceId.
  removeFromRoom: (instanceId) =>
    set((state) => ({
      placed: state.placed.filter((f) => f.instanceId !== instanceId),
    })),
    
  // It's useful to have a function to update positions later.
  updatePosition: (instanceId, newPosition) => 
    set((state) => ({
        placed: state.placed.map(item => 
            item.instanceId === instanceId 
                ? { ...item, position: newPosition }
                : item
        )
    }))
}));