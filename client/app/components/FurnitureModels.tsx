import React from 'react';
import { useFurnitureStore } from '../store/useFurnitureStore';
import FurnitureItem from './FurnitureItem';

const FurnitureModels: React.FC = () => { // Added React.FC type for clarity
  const placedFurniture = useFurnitureStore((state) => state.placed);

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
    </>
  );
};

export default FurnitureModels;