import { useEffect, useRef } from 'react';
import { Layout } from '../../Components';
import GameLink from '../../Components/GameLink/GameLink';
import InputEvent from '../../input';
import './Home.css';

export default function Home() {
  const millionaireRef = useRef<HTMLAnchorElement>(null);
  const jeopardyRef = useRef<HTMLAnchorElement>(null);
  const familyRef = useRef<HTMLAnchorElement>(null);
  const surveyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    InputEvent.on('one', () => millionaireRef.current?.click());
    InputEvent.on('two', () => jeopardyRef.current?.click());
    InputEvent.on('three', () => familyRef.current?.click());
    InputEvent.on('four', () => surveyRef.current?.click());
  }, []);

  return (
    <Layout title="Break the Ice Device">
      <h2>Press Button to Play</h2>
      <ol>
        <GameLink ref={millionaireRef} to="/mil" text="Millionaire" />
        <GameLink ref={jeopardyRef} to="/jeopardy" text="Jeopardy" />
        <GameLink ref={familyRef} to="/family" text="Family Feud" />
        <GameLink ref={surveyRef} to="/survey" text="Family Feud Survey" />
      </ol>
    </Layout>
  );
}
