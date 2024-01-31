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
      <li>
        <Link ref={ref} to={to}>
          <span>{text}</span>
        </Link>
      </li>
    );
  },
);

export default GameLink;
