import React from 'react';
import { useFurnitureStore } from '../store/useFurnitureStore';
import FurnitureItem from './FurnitureItem';
import { Html } from '@react-three/drei';

const FurnitureModels: React.FC = () => { // Added React.FC type for clarity
  const placedFurniture = useFurnitureStore((state) => state.placed);
  const removeFromRoom = useFurnitureStore((s) => s.removeFromRoom);

  return (
    <>
      {placedFurniture.map((item) => (
        <FurnitureItem
          key={item.instanceId} // <--- FIX 1: Add the unique key prop
          id={item.instanceId}
          model={item.model}
          initialPosition={item.position}
          initialRotation={item.rotation} // This value needs to be defined
        />
      ))}
      {/* Simple on-canvas hint for deletion */}
      {placedFurniture.length > 0 && (
        <Html position={[0, 3, 0]} center>
          <div style={{ background: '#111827', color: 'white', padding: '6px 10px', borderRadius: 6, fontSize: 12, opacity: 0.9 }}>
            Click item to select. Press Delete/Backspace to remove. Press M/R to move/rotate.
          </div>
        </Html>
      )}
    </>
  );
};

export default FurnitureModels;