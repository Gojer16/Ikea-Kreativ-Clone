import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RoomBackground from './RoomBackground';
import { useRoomStore } from '../store/roomStore';

const RoomCanvas = () => {
  const imageUrl = useRoomStore((state) => state.imageUrl);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }} //Want a closer camera view? Use z: 3 instead of 5
      style={{ width: '100%',height: '50vh' }}
    >
      {imageUrl && <RoomBackground imageUrl={imageUrl} />}


      <OrbitControls
        enableRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
        enablePan={true}
      />
    </Canvas>
  );
};

export default RoomCanvas;
