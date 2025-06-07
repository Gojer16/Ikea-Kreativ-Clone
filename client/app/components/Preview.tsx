import React from 'react'
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export const Preview = () => {
  return (
     <div style={{ width: "100%", height: "100vh" }}>
      <Suspense fallback={<p>Loading 3D...</p>}>
        <ModelViewer modelUrl="/3d-models/8.glb" />
      </Suspense>
    </div>
)}
