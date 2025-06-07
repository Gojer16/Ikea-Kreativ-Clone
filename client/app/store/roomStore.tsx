import { create } from 'zustand';

type BackgroundType = 'uploaded' | 'template' | null;

interface RoomState {
  backgroundType: BackgroundType;
  templateId: string | null;
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  setTemplateId: (id: string) => void;
  setBackgroundType: (type: BackgroundType) => void;
  clearRoomData: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  backgroundType: null,
  templateId: null,
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
  setTemplateId: (id) => set({ templateId: id }),
  setBackgroundType: (type) => set({ backgroundType: type }),
  clearRoomData: () =>
    set({
      imageUrl: null,
      templateId: null,
      backgroundType: null,
    }),
}));
