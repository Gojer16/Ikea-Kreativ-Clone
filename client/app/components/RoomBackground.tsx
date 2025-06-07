import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useRoomStore } from '../store/roomStore';
import { roomTemplates } from '../constants/roomTemplate'; // Import template registry

const RoomBackground: React.FC = () => {
  // Get background source from store
  const { backgroundType, imageUrl, templateId } = useRoomStore(state => ({
    backgroundType: state.backgroundType,
    imageUrl: state.imageUrl,
    templateId: state.templateId
  }));

  // Determine final background URL
  let backgroundUrl = '';
  if (backgroundType === 'uploaded' && imageUrl) {
    backgroundUrl = imageUrl;
  } else if (backgroundType === 'template' && templateId) {
    backgroundUrl = roomTemplates[templateId]?.background || '';
  }

  // Load texture
  const texture: THREE.Texture | undefined = useLoader(
    TextureLoader,
    backgroundUrl || '',
    (loader) => { loader.crossOrigin = ''; }
  );

  // Optimize texture settings
  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = texture?.anisotropy || 1;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Calculate dimensions based on source
  const getDimensions = (): [number, number] => {
    if (backgroundType === 'template' && templateId) {
      const template = roomTemplates[templateId];
      return template 
        ? [template.dimensions.width, template.dimensions.height] 
        : [10, 10];
    }
    
    // Default dimensions for uploaded images
    return [10, 6.25];
  };

  const planeSize = getDimensions();

  if (!backgroundUrl || !texture) return null;

  return (
    <mesh position={[0, 0, -1]} renderOrder={-1}>
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