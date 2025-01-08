import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import Card from './components/card';
import './App.css';

const CARD_PAIRS = 6;
const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭'];

function App() {
  const [cards, setCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // Add this to prevent multiple clicks

  useEffect(() => {
    WebApp.ready();
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardPairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        image: emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsChecking(false);
  };

  const handleCardClick = (cardId) => {
    // Prevent clicking if already checking a pair or clicking the same card
    if (isChecking || 
        flippedCards.length === 2 || 
        flippedCards.some(card => card.id === cardId) ||
        cards.find(card => card.id === cardId).isMatched) {
      return;
    }

    const newCards = cards.map(card => {
      if (card.id === cardId) {
        return { ...card, isFlipped: true };
      }
      return card;
    });

    const newFlippedCards = [...flippedCards, newCards.find(card => card.id === cardId)];
    setCards(newCards);
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      setTimeout(() => checkMatch(newFlippedCards), 1000);
    }
  };

  const checkMatch = (currentFlippedCards) => {
    const [firstCard, secondCard] = currentFlippedCards;

    if (firstCard.image === secondCard.image) {
      // Match found
      createConfetti();
      setCards(cards.map(card => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return { ...card, isMatched: true, isFlipped: true };
        }
        return card;
      }));
      setMatchedPairs(prev => prev + 1);
    } else {
      // No match
      setCards(cards.map(card => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return { ...card, isFlipped: false };
        }
        return card;
      }));
    }
    setFlippedCards([]);
    setIsChecking(false);
  };

  const handleRestart = () => {
    initializeGame();
  };

  const createConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="App">
       {showConfetti && (
        Array(20).fill().map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))
      )}
      <header className="App-header">
        <h1>Audiencelogy Memory Game</h1>
        <div className="game-stats">
          <p>Moves: {moves}</p>
          <p>Matches: {matchedPairs} / {CARD_PAIRS}</p>
        </div>
        <div className="game-board">
          {cards.map(card => (
            <Card
              key={card.id}
              id={card.id}
              image={card.image}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
            />
          ))}
        </div>
        <button className="restart-button" onClick={handleRestart}>
          Restart Game
        </button>
      </header>
    </div>
  );
}

export default App;