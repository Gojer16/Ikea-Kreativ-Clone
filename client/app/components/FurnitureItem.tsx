// FurnitureItem.tsx (Modified to enable vertical dragging)
import React, { useRef, useEffect, useState } from 'react';
import { Group } from 'three';
import { TransformControls, Html } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import { GRID_CELL_SIZE, SNAP_THRESHOLD } from '../constants/gridSettings';
import { useSelectionStore } from '../store/useSelectionStore';
import { useFurnitureStore } from '../store/useFurnitureStore';


interface ModelComponentOwnProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  [key: string]: unknown;
}

type ForwardRefComponent<T, P = object> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;

interface FurnitureItemProps {
  model: ForwardRefComponent<Group, ModelComponentOwnProps>;
  id: string;
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
}

const FurnitureItem = ({ model: ModelComponent, id, initialPosition, initialRotation }: FurnitureItemProps) => {
  const ref = useRef<Group>(null!);
  const controlsRef = useRef<TransformControlsImpl>(null!);
  // const { camera, gl } = useThree();

  const { selectedObject, setSelectedObject } = useSelectionStore((state) => ({
    selectedObject: state.selectedObject,
    setSelectedObject: state.setSelectedObject,
  }));

  const { updateItemTransform } = useFurnitureStore();

  const [mode, setMode] = useState<'translate' | 'rotate'>('translate');
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedObject === id;

  useEffect(() => {
    if (!isSelected) {
      document.body.style.cursor = isHovered ? 'grab' : 'default';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
        document.body.style.cursor = 'default';
    };
  }, [isHovered, isSelected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isSelected) return;
      if (e.key === 'r') setMode('rotate');
      if (e.key === 'm') setMode('translate');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSelected]);

  const instance = (
    <ModelComponent
      ref={ref}
      position={initialPosition}
  rotation={initialRotation}
      onClick={(e: React.PointerEvent) => {
        e.stopPropagation();
        setSelectedObject(id);
      }}
      onPointerOver={(e: React.PointerEvent) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e: React.PointerEvent) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
    >
      {isHovered && !isSelected && (
        <meshStandardMaterial
          attach="material"
          color="#ADD8E6"
          emissive="#222222"
          transparent
          opacity={0.3}
          depthTest={false}
          depthWrite={false}
        />
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
          // --- CHANGE HERE: REMOVE showY={false} OR SET TO true ---
          // Removing it allows TransformControls to show the Y-axis handle by default
          // If you explicitly want to show it, you could also set showY={true}
          // showY={false} <-- REMOVE THIS LINE or change to showY={true}
          onMouseUp={() => {
            if (ref.current) {
              const newPos = ref.current.position;
              const newRot = ref.current.rotation;

              // --- IMPORTANT: Decide if you want to keep forcing Y=0 ---
              // If you want to allow *any* vertical movement, you MUST remove this line.
              // If you want it to be movable vertically *during* drag, but always snap to Y=0 on release, keep it.
              // Given "I can't move the furniture vertically", I assume you want to allow free vertical movement.
              // So, commenting it out allows the Y position to persist after drag.
              // newPos.y = 0; // <-- COMMENT OUT OR REMOVE THIS LINE TO ALLOW FREE VERTICAL MOVEMENT

              (['x', 'z'] as const).forEach((axis) => {
                const currentVal = newPos[axis];
                const nearestGridCenter = Math.round(currentVal / GRID_CELL_SIZE) * GRID_CELL_SIZE;
                const distanceToNearestCenter = Math.abs(currentVal - nearestGridCenter);

                if (distanceToNearestCenter < SNAP_THRESHOLD) {
                  newPos[axis] = nearestGridCenter;
                }
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