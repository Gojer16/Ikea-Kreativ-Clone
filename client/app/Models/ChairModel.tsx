import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const ChairModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/3d-models/2.glb');
  return <primitive ref={ref} object={scene} {...props} />;
});

export default ChairModel;