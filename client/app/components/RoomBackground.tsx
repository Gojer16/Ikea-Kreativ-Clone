// RoomBackground.tsx
import React, { useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber'; // Import useThree for renderer capabilities
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useRoomStore } from '../store/roomStore';
import { roomTemplates } from '../constants/roomTemplate'; // Assuming this path is correct

// Define a maximum width for the background plane to scale images proportionally
const MAX_PLANE_WIDTH = 10; 

const RoomBackground: React.FC = () => {
  const { gl } = useThree(); // Get the WebGLRenderer capabilities
  const { backgroundType, imageUrl, templateId } = useRoomStore((state) => ({
    backgroundType: state.backgroundType,
    imageUrl: state.imageUrl,
    templateId: state.templateId,
  }));

  let backgroundUrl = '';
  if (backgroundType === 'uploaded' && imageUrl) {
    backgroundUrl = imageUrl;
  } else if (backgroundType === 'template' && templateId) {
    backgroundUrl = roomTemplates.find(t => t.id === templateId)?.imageUrl || '';
  }

  const texture = backgroundUrl
    ? useLoader(TextureLoader, backgroundUrl, (loader) => { loader.crossOrigin = ''; })
    : undefined;

  // State to hold the calculated dimensions of the plane geometry
  const [planeDimensions, setPlaneDimensions] = useState<[number, number]>([MAX_PLANE_WIDTH, MAX_PLANE_WIDTH * 0.625]); // Default aspect ratio (16:10 or 10:6.25)

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = gl.capabilities.getMaxAnisotropy(); // Use max anisotropy for better quality
      texture.needsUpdate = true;

      if (backgroundType === 'uploaded' && texture.image.width && texture.image.height) {
        // Calculate dimensions for uploaded images to maintain aspect ratio
        const imageAspectRatio = texture.image.width / texture.image.height;
        const calculatedHeight = MAX_PLANE_WIDTH / imageAspectRatio;
        setPlaneDimensions([MAX_PLANE_WIDTH, calculatedHeight]);
      } else if (backgroundType === 'template' && templateId) {
        // Use predefined dimensions for templates
        const template = roomTemplates.find(t => t.id === templateId);
        setPlaneDimensions(template?.defaultPlaneSize ?? [MAX_PLANE_WIDTH, MAX_PLANE_WIDTH * 0.625]); // Fallback if template has no size
      }
    }
  }, [texture, backgroundType, templateId, gl.capabilities]); // Re-run effect if these dependencies change

  if (!backgroundUrl || !texture) return null; // Only render if there's a URL and texture is loaded

  return (
    <mesh
      position={[0, 0, -1]} // Place slightly behind the origin to avoid z-fighting with floor
      renderOrder={-1} // Ensure background is rendered first
      // Stop propagation of pointer events to prevent background clicks from interfering with furniture selection
      onPointerDown={e => e.stopPropagation()}
      onPointerMove={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <planeGeometry args={planeDimensions} /> {/* Use dynamically calculated dimensions */}
      <meshBasicMaterial
        map={texture}
        toneMapped={false} // Important for displaying images as-is without HDR tone mapping
        side={THREE.FrontSide} // Render only the front side of the plane
        depthTest={false} // Do not test against the depth buffer
        depthWrite={false} // Do not write to the depth buffer (important for transparent effects)
      />
    </mesh>
  );
};

export default RoomBackground;