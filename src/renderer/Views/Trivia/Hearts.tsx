import { IoMdHeart } from 'react-icons/io';

type Player = {
  lives: number;
  correctAnswers: number;
  answer: number;
};

export default function Hearts({ players }: { players: Array<Player> }) {
  return (
    <div className="correct-answers">
      {players.map((player, i) => (
        <div key={i}>
          {[...Array(player.lives)].map((_, j) => (
            <IoMdHeart key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}
