import React from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { useRoomStore } from '../store/roomStore';
import { useSelectionStore } from '../store/useSelectionStore';
import RoomBackground from './RoomBackground';
import FurnitureModels from './FurnitureModels';

const Scene: React.FC = () => {
  const imageUrl = useRoomStore((s) => s.imageUrl);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const handlePointerMissed = (e: ThreeEvent<PointerEvent>) => {
    if (e.type === 'pointerdown') {
      clearSelection();
      document.body.style.cursor = 'default';
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: '100%', height: '50vh' }}
      onPointerMissed={handlePointerMissed}
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
      <Suspense fallback={null}>
        {imageUrl && <RoomBackground imageUrl={imageUrl} />}
        <FurnitureModels />
      </Suspense>

      {/* Global Outline Glow for Selected Items */}
      <EffectComposer multisampling={4}>
        <Outline
          visibleEdgeColor="yellow"
          hiddenEdgeColor="black"
          blur
          edgeStrength={5}
          width={1000}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
