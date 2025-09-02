import { create } from 'zustand';

type BackgroundType = 'uploaded' | 'template' | null;

interface RoomState {
  backgroundType: BackgroundType;
  templateId: string | null;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  setTemplateId: (id: string | null) => void;
  setBackgroundType: (type: BackgroundType) => void;
  clearRoomData: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  // initial state
  backgroundType: null,
  templateId: null,
  imageUrl: null,

  // actions
  setImageUrl: (url: string | null) =>
    set({
      imageUrl: url,
      templateId: null, // Clear template when an image is uploaded (or cleared)
      backgroundType: url ? 'uploaded' : null,
    }),

  setTemplateId: (id: string | null) =>
    set({
      templateId: id,
      imageUrl: null, // Clear uploaded image when a template is selected (or cleared)
      backgroundType: id ? 'template' : null,
    }),

  setBackgroundType: (type: BackgroundType) =>
    set({
      backgroundType: type,
    }),

  clearRoomData: () =>
    set({
      imageUrl: null,
      templateId: null,
      backgroundType: null,
    }),
}));
