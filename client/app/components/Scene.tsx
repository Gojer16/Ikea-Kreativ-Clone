'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { useSelectionStore } from '../store/useSelectionStore';
import { useFurnitureStore } from '../store/useFurnitureStore';
import ErrorBoundary from './common/ErrorBoundary';
import RoomBackground from './RoomBackground';
import FurnitureModels from './FurnitureModels';
import { useUiStore } from '../store/useUiStore';

const Scene: React.FC = () => {
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const selectedObject = useSelectionStore((s) => s.selectedObject);
  const removeFromRoom = useFurnitureStore((s) => s.removeFromRoom);
  const placed = useFurnitureStore((s) => s.placed);
  const loadFromSerialized = useFurnitureStore((s) => s.loadFromSerialized);
  const performanceOverlay = useUiStore((s) => s.performanceOverlay);
  const undo = useFurnitureStore((s) => s.undo);
  const redo = useFurnitureStore((s) => s.redo);

  const handlePointerMissed = (event: MouseEvent) => {
    if (event.type === 'pointerdown') {
      clearSelection();
      document.body.style.cursor = 'default';
    }
  };

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
        removeFromRoom(selectedObject);
      }
      // Undo/Redo shortcuts: Cmd/Ctrl+Z and Shift+Cmd/Ctrl+Z
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedObject, removeFromRoom, undo, redo]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('furniture-state');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.placed)) {
          loadFromSerialized({ placed: parsed.placed });
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    try {
      const serialized = {
        placed: placed.map(p => ({
          instanceId: p.instanceId,
          catalogId: p.catalogId,
          position: p.position,
          rotation: p.rotation,
        }))
      };
      localStorage.setItem('furniture-state', JSON.stringify(serialized));
    } catch {}
  }, [placed]);

  // Register capture and fit handlers
  // We'll set them up via refs after Canvas mounts
  const glRef = React.useRef<any>(null);
  const cameraRef = React.useRef<any>(null);

  React.useEffect(() => {
    const capture = () => {
      try {
        const gl = glRef.current;
        if (!gl) return null;
        return gl.domElement.toDataURL('image/png');
      } catch {
        return null;
      }
    };
    const fit = () => {
      try {
        const cam = cameraRef.current;
        if (!cam) return;
        cam.position.set(0, 0, 6);
        cam.updateProjectionMatrix();
      } catch {}
    };
    // can't import here, so use window store setter via dynamic import pattern is not feasible.
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: '100%', height: '65vh' }}
      onPointerMissed={handlePointerMissed}
      onCreated={({ gl, camera }) => {
        // register screenshot/fit into UI store
        try {
          const { useUiStore } = require('../store/useUiStore');
          const setCaptureFn = useUiStore.getState().setCaptureFn;
          const setFitFn = useUiStore.getState().setFitFn;
          const setCameraPresetRunner = useUiStore.getState().setCameraPresetRunner;
          glRef.current = gl;
          cameraRef.current = camera;
          setCaptureFn(() => () => {
            try { return gl.domElement.toDataURL('image/png'); } catch { return null; }
          });
          setFitFn(() => () => {
            try { camera.position.set(0, 0, 6); camera.updateProjectionMatrix(); } catch {}
          });
          setCameraPresetRunner(() => (name: 'front' | 'left' | 'iso' | 'reset') => {
            try {
              if (name === 'front') camera.position.set(0, 0, 6);
              if (name === 'left') camera.position.set(-6, 0, 0.01);
              if (name === 'iso') camera.position.set(6, 6, 6);
              if (name === 'reset') camera.position.set(0, 0, 6);
              camera.lookAt(0, 0, 0);
              camera.updateProjectionMatrix();
            } catch {}
          });
        } catch {}
      }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />

      {/* Camera Controls */}
      <OrbitControls
        enableRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
        enablePan={false}
      />

      {/* Scene Contents */}
      <ErrorBoundary message="There was a problem rendering the scene.">
        <Suspense fallback={null}>
          <RoomBackground />
          <FurnitureModels />
        </Suspense>
      </ErrorBoundary>

      {performanceOverlay && <Stats />}

      {/* Global Outline Glow for Selected Items */}
      <EffectComposer multisampling={4}>
        <Outline
          // numeric hex color values (expected by @react-three/postprocessing typings)
          visibleEdgeColor={0xffff00} // yellow
          hiddenEdgeColor={0x000000}  // black
          blur
          edgeStrength={5}
          width={1000}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
