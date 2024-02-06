import { useEffect, useRef } from 'react';
import Layout from '../../Shared/Layout';
import GameLink from '../../Components/GameLink/GameLink';
import Input from '../../input';
import './Home.css';

export default function Home() {
  const triviaRef = useRef<HTMLAnchorElement>(null);
  const jeopardyRef = useRef<HTMLAnchorElement>(null);
  const familyRef = useRef<HTMLAnchorElement>(null);
  const surveyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const input = new Input('one');
    input.InputEvent.on('one', () => triviaRef.current?.click());
    input.InputEvent.on('two', () => jeopardyRef.current?.click());
    input.InputEvent.on('three', () => familyRef.current?.click());
    input.InputEvent.on('four', () => surveyRef.current?.click());

    return () => {
      input.InputEvent.removeAllListeners();
    };
  }, []);

  return (
    <Layout title="Break the Ice Device">
      <h2>Press Button to Play</h2>
      <div className="gamelink-con">
        <GameLink ref={triviaRef} to="/trivia" text="Trivia" />
        <GameLink ref={jeopardyRef} to="/jeopardy" text="Jeopardy" />
        <GameLink ref={familyRef} to="/family" text="Family Feud" />
        <GameLink ref={surveyRef} to="/survey" text="Family Feud Survey" />
      </div>
    </Layout>
  );
}
