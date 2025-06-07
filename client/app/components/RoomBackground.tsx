import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useRoomStore } from '../store/roomStore';
import { roomTemplates } from '../constants/roomTemplate';

const RoomBackground: React.FC = () => {
  const { backgroundType, imageUrl, templateId } = useRoomStore((state) => ({
    backgroundType: state.backgroundType,
    imageUrl: state.imageUrl,
    templateId: state.templateId,
  }));

  // Resolve final image URL
  let backgroundUrl = '';
  if (backgroundType === 'uploaded' && imageUrl) {
    backgroundUrl = imageUrl;
  } else if (backgroundType === 'template' && templateId) {
    backgroundUrl = roomTemplates.find(t => t.id === templateId)?.imageUrl || '';
  }

  const texture = backgroundUrl
    ? useLoader(TextureLoader, backgroundUrl, (loader) => { loader.crossOrigin = ''; })
    : undefined;

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 1;
      texture.needsUpdate = true;
    }
  }, [texture]);

  const getDimensions = (): [number, number] => {
    if (backgroundType === 'template' && templateId) {
      const template = roomTemplates.find(t => t.id === templateId);
      return template?.defaultPlaneSize ?? [10, 6.25];
    }

    return [10, 6.25]; // fallback for uploaded
  };

  const planeSize = getDimensions();

  if (!backgroundUrl || !texture) return null;

  return (
    <mesh
    position={[0, 0, -1]}
    renderOrder={-1}
    onPointerDown={e => e.stopPropagation()}
    onPointerMove={e => e.stopPropagation()}
    onPointerUp={e => e.stopPropagation()}
    onClick={e => e.stopPropagation()}
    >
  <planeGeometry args={planeSize} />
  <meshBasicMaterial
    map={texture}
    toneMapped={false}
    side={THREE.FrontSide}
    depthTest={false}
    depthWrite={false}
  />
</mesh>
  );
};

export default RoomBackground;
