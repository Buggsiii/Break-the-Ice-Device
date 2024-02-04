import { Canvas, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Layout from '../../Shared/Layout';

function Hall() {
  const hall = useLoader(FBXLoader, 'models/hall.fbx');
  return <primitive object={hall} />;
}

export default function Trivia() {
  return (
    <Layout title="Crazy Trivia" back>
      <Canvas>
        <ambientLight />
        <Hall />
      </Canvas>
    </Layout>
  );
}
