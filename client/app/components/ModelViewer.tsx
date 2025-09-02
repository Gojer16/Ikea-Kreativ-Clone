'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type ModelProps = { url: string };

function Model({ url }: ModelProps) {
  const gltf = useGLTF(url) as unknown as { scene: THREE.Object3D };
  const { scene } = gltf;
  return <primitive object={scene} scale={1.5} />;
}

type ModelViewerProps = { modelUrl: string };

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  try {
    if (typeof useGLTF.preload === 'function') useGLTF.preload(modelUrl);
  } catch {
    // ignore preload errors (non-critical)
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
