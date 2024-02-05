import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import CameraControls from 'camera-controls';
import Layout from '../../Shared/Layout';
import Input from '../../input';
import './Trivia.css';
import Questions from './../../../../data/questions.json';
import { Stats } from '@react-three/drei';

CameraControls.install({ THREE });

function Hall() {
  const hall = useLoader(FBXLoader, 'models/hall.fbx');
  const texture = new THREE.TextureLoader().load('textures/hall.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  const material = new THREE.MeshStandardMaterial({ map: texture });
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

const answeredKeys: Array<string> = [];
let currentKey: string;
function getRandomKey() {
  const keys = Object.keys(Questions);
  let key: string = '';

  while (key == '' || answeredKeys.includes(key)) {
    const index = Math.floor(Math.random() * keys.length);
    key = keys[index];
  }

  console.log(key, answeredKeys, answeredKeys.includes(key));
  answeredKeys.push(key);
  currentKey = key;
  return { key: key, value: (Questions as any)[key] };
}

function isAnswerCorrect(index: number) {
  console.log((Questions as any)[currentKey]['correct']);
  return (Questions as any)[currentKey]['correct'] == index;
}

export default function Trivia() {
  const [zPos, setZPos] = useState(0);
  const [question, setQuestion] = useState(getRandomKey());
  console.log(question);

  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLButtonElement>(null);
  const btn3Ref = useRef<HTMLButtonElement>(null);
  const btn4Ref = useRef<HTMLButtonElement>(null);

  function answer(index: number) {
    const isCorrect = isAnswerCorrect(index);
    console.log(isCorrect);

    if (isCorrect) setZPos((last: number) => (last -= 10));
    setQuestion(getRandomKey());
  }

  useEffect(() => {
    // const timer = setTimeout(() => setZPos(-10), 4000);

    const inputOne = new Input('one');
    inputOne.InputEvent.on('one', () => btn1Ref.current?.click());
    inputOne.InputEvent.on('two', () => btn2Ref.current?.click());
    inputOne.InputEvent.on('three', () => btn3Ref.current?.click());
    inputOne.InputEvent.on('four', () => btn4Ref.current?.click());

    return () => {
      inputOne.InputEvent.removeAllListeners();
      // clearTimeout(timer);
    };
  }, []);

  return (
    <Layout title="Crazy Trivia" back>
      <Canvas camera={{ position: new THREE.Vector3(0, 0, 0) }}>
        <fog attach="fog" args={['#000', 5, 10]} />
        <ambientLight intensity={0.1} />
        <Lights length={100} />
        <Hall />
        <Controls pos={new THREE.Vector3(0, 0, zPos)} />
        <Stats />
      </Canvas>
      <h2 className="question">{question.key}</h2>
      <div className="btn-wrapper">
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
    </Layout>
  );
}
