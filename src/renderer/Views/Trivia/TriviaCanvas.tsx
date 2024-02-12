import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Vignette,
  Bloom,
  Noise,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import Controls from './Controls';
import Lights from './Lights';
import Hall from './Hall';
import Win from './Win';
import Title from './Title';

export default function TriviaCanvas({
  isGameOver,
  wonPlayerIndex,
  zPos,
}: {
  isGameOver: boolean;
  wonPlayerIndex: number;
  zPos: number;
}) {
  return (
    <Canvas
      camera={{
        position: new THREE.Vector3(0, 0, 12),
        near: 0.01,
      }}
    >
      <EffectComposer>
        <Vignette eskil={false} offset={0.2} darkness={1.1} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.05} />
      </EffectComposer>
      <fog attach="fog" args={['#000', 5, 10]} />
      <ambientLight intensity={0.1} />
      <Lights length={100} />
      <Hall />
      <Controls pos={new THREE.Vector3(0, 0, zPos)} />
      <Title />
      {isGameOver && <Win player={wonPlayerIndex} />}
    </Canvas>
  );
}
