import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './Controls';
import Layout from '../../Shared/Layout';
import Input from '../../input';
import Questions from './../../../../data/questions.json';
import Confetti from '../../Components/Confetti/Confetti';
import TriviaCanvas from './TriviaCanvas';
import Hearts from './Hearts';
import './Trivia.css';
import Answers from './Answers';

const keys = Object.keys(Questions);
function getRandomKey() {
  const index = Math.floor(Math.random() * keys.length);
  const key = keys[index];

  keys.splice(index, 1);

  if (keys.length === 0) keys.push(...Object.keys(Questions));
  return { key: key, value: (Questions as any)[key] };
}

type Player = {
  lives: number;
  correctAnswers: number;
  answer: number;
};

export default function Trivia() {
  const [canAnswer, setCanAnswer] = useState(false);
  const [zPos, setZPos] = useState(10);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [question, setQuestion] = useState(getRandomKey);
  const [wonPlayerIndex, setWonPlayerIndex] = useState(-1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [players, setPlayers] = useState<Array<Player>>([
    {
      lives: 3,
      correctAnswers: 0,
      answer: -1,
    },
    // {
    //   lives: 3,
    //   correctAnswers: 0,
    //   answer: -1,
    // },
  ]);
  const navigate = useNavigate();

  function answer(index: number, playerIndex: number) {
    if (!isGameStarted) return;
    if (!canAnswer) return;

    setPlayers((prev) => {
      prev[playerIndex].answer = index;
      return prev;
    });

    let hasAllPlayersAnswered = true;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.answer === -1) {
        hasAllPlayersAnswered = false;
        break;
      }
    }

    if (!hasAllPlayersAnswered) return;

    setZPos((last: number) => last - 10);
    setCanAnswer(false);

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const isCorrect = player.answer === question.value.correct;

      setPlayers((prev) => {
        prev[i].answer = -1;
        return prev;
      });

      if (isCorrect) {
        setPlayers((prev) => {
          prev[i].correctAnswers++;
          return prev;
        });

        break;
      }

      setPlayers((prev) => {
        prev[i].lives--;
        return prev;
      });
    }
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
    if (isGameStarted) return;
    setIsGameStarted(true);
    setZPos(0);
  }

  function toMenu() {
    navigate('/');
  }

  const inputOne = new Input('one');
  useEffect(() => {
    if (!isGameStarted) {
      inputOne.InputEvent.on('any', startGame);
    }

    if (zPos === -100) {
      setIsGameOver(true);
      inputOne.InputEvent.on('any', toMenu);

      const playerIndex =
        players[0].correctAnswers === players[1].correctAnswers
          ? -1
          : players[0].correctAnswers > players[1].correctAnswers
          ? 0
          : 1;
      if (playerIndex === -1) return;
      setWonPlayerIndex(playerIndex);

      return;
    }

    const interval = setInterval(updateCanAnswer, 100);

    return () => {
      inputOne.InputEvent.removeAllListeners();
      clearInterval(interval);
    };
  }, [canAnswer, zPos]);

  useEffect(() => {
    if (!isGameStarted) return;

    inputOne.InputEvent.on('any', (e) => answer(e, 0));

    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, [isGameStarted, canAnswer, players, question]);

  return (
    <Layout title="Trivia" back>
      <TriviaCanvas
        isGameOver={isGameOver}
        wonPlayerIndex={wonPlayerIndex}
        zPos={zPos}
      />
      <Answers question={question} canAnswer={canAnswer} />
      <Hearts players={players} />
      <Confetti amount={1000} enabled={isGameOver} />
    </Layout>
  );
}
