import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import CameraControls from 'camera-controls';
import Layout from '../../Shared/Layout';
import Input from '../../input';
import './Trivia.css';
import Questions from './../../../../data/questions.json';
import { Center, Stats, Text3D } from '@react-three/drei';
import { IoMdHeart } from 'react-icons/io';
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import create from 'zustand';

CameraControls.install({ THREE });

type ZPosStore = {
  zPos: number;
  setZPos: (zPos: number) => void;
};

const useStore = create<ZPosStore>((set) => ({
  zPos: 12,
  setZPos: (zPos: number) => set({ zPos }),
}));

function Hall() {
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

function Controls({ pos }: { pos: THREE.Vector3 }) {
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

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}

function BlinkingLight({ zPos }: { zPos: number }) {
  const [intensity, setIntensity] = useState(Math.random());
  let targetIntensity = Math.random();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.abs(intensity - targetIntensity) < 1)
        targetIntensity = Math.random();
      setIntensity((last) => lerp(last, targetIntensity, 0.5));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <pointLight position={[0, 0.5, zPos]} intensity={intensity} />;
}

function Lights({ length }: { length: number }) {
  return (
    <>
      {[...Array(length / 4)].map((_, i) => (
        <BlinkingLight key={i} zPos={-i * 4 - 2} />
      ))}
    </>
  );
}

function Title() {
  return (
    <>
      <Center position={[0, 0.2, 3]}>
        <Text3D font={'./fonts/Roboto Black_Regular.json'} bevelEnabled>
          TRIVIA
        </Text3D>
      </Center>
      <Center position={[0, -0.7, 3]}>
        <Text3D
          font={'./fonts/Roboto_Regular.json'}
          size={0.5}
          bevelEnabled
          bevelThickness={0.1}
        >
          PRESS ANYTHING
        </Text3D>
      </Center>
      <BlinkingLight zPos={6} />
    </>
  );
}

function Win() {
  return (
    <>
      <Center position={[0, 0.2, -105]}>
        <Text3D font={'./fonts/Roboto Black_Regular.json'} bevelEnabled>
          YOU WON!
        </Text3D>
      </Center>
      <Center position={[0, -0.7, -105]}>
        <Text3D
          font={'./fonts/Roboto_Regular.json'}
          size={0.5}
          bevelEnabled
          bevelThickness={0.1}
        >
          PRESS 1
        </Text3D>
      </Center>
      <BlinkingLight zPos={6} />
    </>
  );
}

const keys = Object.keys(Questions);
function getRandomKey() {
  const index = Math.floor(Math.random() * keys.length);
  const key = keys[index];

  keys.splice(index, 1);

  if (keys.length === 0) keys.push(...Object.keys(Questions));
  return { key: key, value: (Questions as any)[key] };
}

function isAnswerCorrect(correct: number, index: number) {
  return correct == index;
}

export default function Trivia() {
  const [canAnswer, setCanAnswer] = useState(false);
  const [lives, setLives] = useState(3);
  const [zPos, setZPos] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState(getRandomKey);

  function answer(index: number) {
    if (!gameStarted) return;
    if (!canAnswer) return;
    const isCorrect = isAnswerCorrect(question.value.correct, index);

    setZPos((last: number) => last - 10);
    setCanAnswer(false);

    if (isCorrect) return;
    setLives((last: number) => last - 1);
  }

  function updateCanAnswer() {
    const currentZPos = useStore.getState().zPos;

    if (currentZPos > 1) return;
    if (currentZPos - zPos < 1) {
      if (canAnswer) return;
      setCanAnswer(true);
      setQuestion(getRandomKey);
    } else if (canAnswer) setCanAnswer(false);
  }

  function startGame() {
    if (gameStarted) return;
    setGameStarted(true);
    setZPos(0);
  }

  const inputOne = new Input('one');
  useEffect(() => {
    inputOne.InputEvent.on('one', startGame);
    inputOne.InputEvent.on('two', startGame);
    inputOne.InputEvent.on('three', startGame);
    inputOne.InputEvent.on('four', startGame);

    const interval = setInterval(updateCanAnswer, 100);

    return () => {
      inputOne.InputEvent.removeAllListeners();
      clearInterval(interval);
    };
  }, [canAnswer, zPos]);

  useEffect(() => {
    if (!gameStarted) return;
    console.log('zPos', zPos);

    inputOne.InputEvent.on('one', () => answer(1));
    inputOne.InputEvent.on('two', () => answer(2));
    inputOne.InputEvent.on('three', () => answer(3));
    inputOne.InputEvent.on('four', () => answer(4));

    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, [gameStarted, canAnswer]);

  return (
    <Layout title="Trivia" back>
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
        <Win />
        <Stats />
      </Canvas>
      <div className="correct-answers">
        {[...Array(lives > 0 ? lives : 0)].map((_, i) => (
          <IoMdHeart key={i} />
        ))}
      </div>
      <div className={`btn-wrapper ${canAnswer ? 'can-answer' : ''}`}>
        <h2 className="question">{question.key}</h2>
        <button onClick={() => answer(1)}>{question.value['ans1']}</button>
        <button onClick={() => answer(2)}>{question.value['ans2']}</button>
        <button onClick={() => answer(3)}>{question.value['ans3']}</button>
        <button onClick={() => answer(4)}>{question.value['ans4']}</button>
      </div>
    </Layout>
  );
}
