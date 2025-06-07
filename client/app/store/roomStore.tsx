import { create } from 'zustand';

interface RoomState {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  clearImageUrl: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
  clearImageUrl: () => set({ imageUrl: null }),
}));
