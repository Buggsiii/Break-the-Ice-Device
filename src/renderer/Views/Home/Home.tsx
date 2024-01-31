import { useEffect, useRef } from 'react';
import Layout from '../../Shared/Layout';
import GameLink from '../../Components/GameLink/GameLink';
import Input from '../../input';
import './Home.css';

export default function Home() {
  const millionaireRef = useRef<HTMLAnchorElement>(null);
  const jeopardyRef = useRef<HTMLAnchorElement>(null);
  const familyRef = useRef<HTMLAnchorElement>(null);
  const surveyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const input = new Input('one');
    input.InputEvent.on('one', () => millionaireRef.current?.click());
    input.InputEvent.on('two', () => jeopardyRef.current?.click());
    input.InputEvent.on('three', () => familyRef.current?.click());
    input.InputEvent.on('four', () => surveyRef.current?.click());
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
