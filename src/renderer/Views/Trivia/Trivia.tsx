import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import CameraControls from 'camera-controls';
import Layout from '../../Shared/Layout';
import Input from '../../input';
import './Trivia.css';
import Questions from './../../../../data/questions.json';
import { Center, Text3D } from '@react-three/drei';
import { IoMdHeart } from 'react-icons/io';

CameraControls.install({ THREE });

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
  return useFrame((state, delta) => {
    state.camera.position.lerp(pos, 0.01);

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
          PRESS 1
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
let currentKey: string;
function getRandomKey() {
  const index = Math.floor(Math.random() * keys.length);
  const key = keys[index];

  keys.splice(index, 1);

  if (keys.length === 0) keys.push(...Object.keys(Questions));
  currentKey = key;
  return { key: key, value: (Questions as any)[key] };
}

function isAnswerCorrect(correct: number, index: number) {
  return correct == index;
}

export default function Trivia() {
  const [lives, setLives] = useState(3);
  const [zPos, setZPos] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState(() => getRandomKey());

  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLButtonElement>(null);
  const btn3Ref = useRef<HTMLButtonElement>(null);
  const btn4Ref = useRef<HTMLButtonElement>(null);

  function answer(index: number) {
    const isCorrect = isAnswerCorrect(question.value.correct, index);

    if (!isCorrect) setLives((last: number) => last - 1);
    setZPos((last: number) => last - 10);
    setQuestion(getRandomKey());
  }

  const inputOne = new Input('one');
  useEffect(() => {
    inputOne.InputEvent.on('one', () => setGameStarted(true));
    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    setZPos(0);

    inputOne.InputEvent.on('one', () => btn1Ref.current?.click());
    inputOne.InputEvent.on('two', () => btn2Ref.current?.click());
    inputOne.InputEvent.on('three', () => btn3Ref.current?.click());
    inputOne.InputEvent.on('four', () => btn4Ref.current?.click());

    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, [gameStarted]);

  return (
    <Layout title="Trivia" back>
      <Canvas camera={{ position: new THREE.Vector3(0, 0, 12), near: 0.01 }}>
        <fog attach="fog" args={['#000', 5, 10]} />
        <ambientLight intensity={0.1} />
        <Lights length={100} />
        <Hall />
        <Controls pos={new THREE.Vector3(0, 0, zPos)} />
        <Title />
        <Win />
      </Canvas>
      {gameStarted && (
        <>
          <div className="correct-answers">
            {[...Array(lives > 0 ? lives : 0)].map((_, i) => (
              <IoMdHeart key={i} />
            ))}
          </div>
          <div className="btn-wrapper">
            <h2 className="question">{question.key}</h2>
            <button ref={btn1Ref} onClick={() => answer(1)}>
              <span>1.</span> {question.value['ans1']}
            </button>
            <button ref={btn2Ref} onClick={() => answer(2)}>
              <span>2.</span> {question.value['ans2']}
            </button>
            <button ref={btn3Ref} onClick={() => answer(3)}>
              <span>3.</span> {question.value['ans3']}
            </button>
            <button ref={btn4Ref} onClick={() => answer(4)}>
              <span>4.</span> {question.value['ans4']}
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}
