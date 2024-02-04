import React from 'react';
import { Link } from 'react-router-dom';
import './GameLink.css';

interface GameLinkProps {
  to: string;
  text: string;
}

const GameLink = React.forwardRef<HTMLAnchorElement, GameLinkProps>(
  ({ to, text }, ref) => {
    return (
      <Link ref={ref} to={to} className="gamelink">
        <span>{text}</span>
      </Link>
    );
  },
);

export default GameLink;
