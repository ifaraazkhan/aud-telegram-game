import React from 'react';
import './card.css';
import { sounds } from '../utils/audioutils';

const Card = ({ id, image, isFlipped, isMatched, onClick }) => {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      sounds.flip.play();
      onClick(id);
    }
  };

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} 
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <span>?</span>
        </div>
        <div className="card-back">
          {image}
        </div>
      </div>
    </div>
  );
};

export default Card;