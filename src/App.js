import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import Card from './components/card';
import './App.css';
import { sounds } from './utils/audioutils';
import TelegramMiniAppSDK from 'telegram-miniapp-sdk';
import AdComponent from './ads';


const CARD_PAIRS = 6;
const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭'];

// Offerwall Modal Componentt
const OfferWallModal = ({ isOpen, onClose, offerwallData }) => {
  
  if (!isOpen) return null;

  const handleTaskClick = (task) => {
    if (task.clickTaskTrackingUrl) {
      fetch(task.clickTaskTrackingUrl);
    }
    if (task.url) {
      //window.location.href = task.url;
      window.open(task.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-game-title">🎮 Daily Rewards</span>
            <br />
            <span className="modal-username">
              {WebApp.initDataUnsafe?.user?.username || 'Player'} ⚡
            </span>
          </div>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {offerwallData?.map((task, index) => (
            <div 
              key={index}
              className="task-item"
              onClick={() => handleTaskClick(task)}
            >
              <div className="task-content">
                {/* Game Icon */}
                <div className="task-icon">
                  <img
                    src={task.icon || '/api/placeholder/64/64'}
                    alt=""
                    className="game-icon"
                  />
                </div>

                {/* Task Info */}
                <div className="task-info">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">
                    {task.description || 'Complete this task to earn rewards!'}
                  </p>
                  
                  {task.status && (
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${task.status}%` }}
                        />
                      </div>
                      <span className="progress-text">{task.status}%</span>
                    </div>
                  )}
                </div>

                {/* Reward Badge */}
                <div className="task-reward">
                  <span className="coin-icon"><img style={{width:"25px"}} src={"https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif"}></img></span>
                  <span className="reward-amount">
                    {typeof task.reward === 'number' 
                      ? task.reward > 1000 
                        ? `UP TO ${Math.floor(task.reward/1000)}k`
                        : task.reward
                      : task.reward}
                  </span>
                  <span>{task.currency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="modal-section-title">
            <small>➕ powered by Dat.network</small>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [cards, setCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerwallData, setOfferwallData] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk_telegram = new TelegramMiniAppSDK({
          apiKey: 'EjJvklHA2dq00xGJRuRa5QCr96dUAkdbJyxuixQ21ADYGcCeJT5LuDf2thVDlaLl',
        });
        
        await sdk_telegram.init();
        
        // After initialization, get offers
        const offersList = await sdk_telegram.getOfferWall();
        console.log("list---",offersList);
        setOfferwallData(offersList);
      } catch (err) {
        console.log(err.message);
      }
    };

    initializeSDK();
  }, []);

  useEffect(() => {
    WebApp.ready();
    initializeGame();
  }, []);

  // Add useEffect to watch matchedPairs
  useEffect(() => {
    if (matchedPairs === CARD_PAIRS) {
      handleGameComplete();
    }
  }, [matchedPairs]);

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

  const handleGameComplete = () => {
    sounds.victory.play();
    // Add a small delay before showing popup
    setTimeout(() => {
      WebApp.showPopup({
        title: '🎉 Congratulations!',
        message: `You completed the game in ${moves} moves!`,
        buttons: [
          {
            id: "restart",
            type: "default",
            text: "Play Again"
          }
        ]
      }).then((buttonId) => {
        if (buttonId) {
          initializeGame();
        }
      });
    }, 500);
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
      sounds.match.play();
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

  // Add console logs to debug
  useEffect(() => {
    console.log('Current matched pairs:', matchedPairs);
    console.log('Total pairs needed:', CARD_PAIRS);
  }, [matchedPairs]);


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
        <button onClick={() => setIsModalOpen(true)} className="earn-rewards-button">
            ⚡ Earn Rewards
          </button>
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
      <OfferWallModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offerwallData={offerwallData}
      />
     
     
    </div>
  );
}

export default App;