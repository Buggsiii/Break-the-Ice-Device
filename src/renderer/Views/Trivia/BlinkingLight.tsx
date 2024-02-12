import { useEffect, useState } from 'react';

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}

export default function BlinkingLight({ zPos }: { zPos: number }) {
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
