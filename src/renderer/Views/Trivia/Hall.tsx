import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function Hall() {
  const hall = useLoader(FBXLoader, 'models/hall.fbx');
  const texture = new THREE.TextureLoader().load('textures/hall.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  // Render both sides of the texture
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  hall.traverse((child: any) => {
    if (!child.isMesh) return;
    child.material = material;
  });

  return <primitive object={hall} />;
}
