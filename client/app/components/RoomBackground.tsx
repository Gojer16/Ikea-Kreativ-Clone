import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useState } from 'react';

const RoomBackground = ({ imageUrl }: { imageUrl: string }) => {
  const texture = useTexture(imageUrl);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [planeSize, setPlaneSize] = useState<[number, number]>([10, 10]);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const ratio = img.width / img.height;
      setAspectRatio(ratio);

      const height = 6.25; 
      const width = ratio * height;
      setPlaneSize([width, height]);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 1;
      texture.needsUpdate = true;
    }
  }, [texture]);

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
