import BlinkingLight from './BlinkingLight';

export default function Lights({ length }: { length: number }) {
  return (
    <>
      {[...Array(length / 4)].map((_, i) => (
        <BlinkingLight key={i} zPos={-i * 4 - 2} />
      ))}
    </>
  );
}
