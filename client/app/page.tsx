'use client';
import FurnitureSelector from "./components/FurnitureSelector";
import ImageUploader from "./components/ImageUploader";

import RoomTemplateSelector from "./components/RoomTemplateSelector";
import Scene from "./components/Scene";

export default function Home() {
  return (
   <>
    <h1 className="text-3xl font-bold text-red-500 ">Hello, World !</h1>
    <ImageUploader />
    <RoomTemplateSelector />
    <FurnitureSelector />
    <div className="min-h-screen">
      <Scene />
    </div>

   </>
  );
}
