// src/store/useRoomStore.ts (Modified)
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
  setBackgroundType: null,
  templateId: null,
  imageUrl: null,

  setImageUrl: (url) => set({
    imageUrl: url,
    templateId: null, // Clear template when an image is uploaded
    backgroundType: 'uploaded', // Set type to uploaded
  }),

  setTemplateId: (id) => set({
    templateId: id,
    imageUrl: null, // Clear uploaded image when a template is selected
    backgroundType: 'template', // Set type to template
  }),

  // clearRoomData remains the same
  clearRoomData: () =>
    set({
      imageUrl: null,
      templateId: null,
      backgroundType: null,
    }),
}));