import { create } from 'zustand';

interface SelectionState {
  selectedObject: string | null; // The ID of the currently selected object
  setSelectedObject: (id: string | null) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedObject: null, // Nothing is selected initially
  setSelectedObject: (id: string | null) => set({ selectedObject: id }),
  clearSelection: () => set({ selectedObject: null }),
}));