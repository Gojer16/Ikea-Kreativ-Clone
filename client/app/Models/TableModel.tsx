import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const TableModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/3d-models/4.glb');
  return <primitive ref={ref} object={scene} {...props} />;
});

export default TableModel;