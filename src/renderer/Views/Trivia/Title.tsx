import { Center, Text3D } from '@react-three/drei';
import BlinkingLight from './BlinkingLight';

export default function Title() {
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
