// FurnitureItem.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Group, Euler } from 'three';
import { useThree } from '@react-three/fiber';
import { TransformControls, Html } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import { GRID_CELL_SIZE } from '../constants/gridSettings';
import { useSelectionStore } from '../store/useSelectionStore'; // Make sure this points to the selection-specific store
import { useFurnitureStore } from '../store/useFurnitureStore';

interface ModelComponentOwnProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  [key: string]: any;
}

type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;

interface FurnitureItemProps {
  model: ForwardRefComponent<Group, ModelComponentOwnProps>;
  id: string;
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
}

const FurnitureItem = ({ model: ModelComponent, id, initialPosition, initialRotation }: FurnitureItemProps) => {
  const ref = useRef<Group>(null!);
  const controlsRef = useRef<TransformControlsImpl>(null!);
  const { camera, gl } = useThree();

  // --- FIX IS HERE ---
  // Select both state and actions explicitly from the store
  const { selectedObject, setSelectedObject } = useSelectionStore((state) => ({
    selectedObject: state.selectedObject,
    setSelectedObject: state.setSelectedObject,
  }));

  const { updateItemTransform } = useFurnitureStore();

  const [mode, setMode] = useState<'translate' | 'rotate'>('translate');
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedObject === id;

  // ... (rest of your component code, it should now work correctly)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isSelected) return;
      if (e.key === 'r') setMode('rotate');
      if (e.key === 'm') setMode('translate');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSelected]);

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'grab' : 'default';
  }, [isHovered]);

  const instance = (
    <ModelComponent
      ref={ref}
      position={initialPosition}
      rotation={new Euler(...initialRotation)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedObject(id); // This will now be a function
      }}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
    >
      {isHovered && !isSelected && (
        <meshStandardMaterial attach="material" color="#aaaaaa" emissive="#222222" transparent opacity={0.8} />
      )}
    </ModelComponent>
  );

  return (
    <>
      {isSelected && (
        <TransformControls
          ref={controlsRef}
          object={ref.current}
          mode={mode}
          onMouseUp={() => {
            if (ref.current) {
              const newPos = ref.current.position;
              const newRot = ref.current.rotation;

              newPos.y = 0;

              (['x', 'z'] as const).forEach((axis) => {
                const val = newPos[axis];
                const snap = Math.round(val / GRID_CELL_SIZE) * GRID_CELL_SIZE;
                newPos[axis] = snap;
              });

              updateItemTransform(id, [newPos.x, newPos.y, newPos.z], [newRot.x, newRot.y, newRot.z]);
            }
          }}
        />
      )}

      {instance}

      {isSelected && (
        <Html position={[initialPosition[0], initialPosition[1] + 1.5, initialPosition[2]]} center>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem', background: mode === 'rotate' ? '#1E90FF' : '#32CD32',
            color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)', userSelect: 'none',
          }}>
            <span>{mode === 'rotate' ? '🔄' : '↕️'}</span>
            <span>{mode === 'rotate' ? 'Rotate' : 'Move'}</span>
          </div>
        </Html>
      )}
    </>
  );
};

export default FurnitureItem;