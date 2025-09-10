import { create } from 'zustand';

type CaptureFn = () => string | null; // returns dataURL or null
type FitFn = () => void;

interface UiState {
  performanceOverlay: boolean;
  units: 'cm' | 'in';
  setPerformanceOverlay: (v: boolean) => void;
  togglePerformanceOverlay: () => void;
  setUnits: (u: 'cm' | 'in') => void;

  // scene actions registered by Scene
  _captureFn: CaptureFn | null;
  setCaptureFn: (fn: CaptureFn | null) => void;
  captureScreenshot: () => string | null;

  _fitFn: FitFn | null;
  setFitFn: (fn: FitFn | null) => void;
  runFitToScene: () => void;

  // camera presets
  _runCameraPreset: ((name: 'front' | 'left' | 'iso' | 'reset') => void) | null;
  setCameraPresetRunner: (fn: ((name: 'front' | 'left' | 'iso' | 'reset') => void) | null) => void;
  runCameraPreset: (name: 'front' | 'left' | 'iso' | 'reset') => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  performanceOverlay: false,
  units: 'cm',
  setPerformanceOverlay: (v) => set({ performanceOverlay: v }),
  togglePerformanceOverlay: () => set((s) => ({ performanceOverlay: !s.performanceOverlay })),
  setUnits: (u) => set({ units: u }),

  _captureFn: null,
  setCaptureFn: (fn) => set({ _captureFn: fn }),
  captureScreenshot: () => {
    const fn = get()._captureFn;
    return fn ? fn() : null;
  },

  _fitFn: null,
  setFitFn: (fn) => set({ _fitFn: fn }),
  runFitToScene: () => {
    const fn = get()._fitFn;
    if (fn) fn();
  },

  _runCameraPreset: null,
  setCameraPresetRunner: (fn) => set({ _runCameraPreset: fn }),
  runCameraPreset: (name) => {
    const fn = get()._runCameraPreset;
    if (fn) fn(name);
  },
}));
