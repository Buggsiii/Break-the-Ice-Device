import { useThree, useFrame } from '@react-three/fiber';
import CameraControls from 'camera-controls';
import { useMemo } from 'react';
import create from 'zustand';
import * as THREE from 'three';

CameraControls.install({ THREE });

type ZPosStore = {
  zPos: number;
  setZPos: (zPos: number) => void;
};

export const useStore = create<ZPosStore>((set) => ({
  zPos: 12,
  setZPos: (zPos: number) => set({ zPos }),
}));

export default function Controls({ pos }: { pos: THREE.Vector3 }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), []);
  const setZPos = useStore((state) => state.setZPos);

  return useFrame((state, delta) => {
    state.camera.position.lerp(pos, 0.01);

    setZPos(state.camera.position.z);

    controls.setPosition(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
      true,
    );
  });
}
