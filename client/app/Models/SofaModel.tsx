import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const SofaModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/3d-models/3.glb');
  return <primitive ref={ref} object={scene} {...props} />;
});

export default SofaModel;