import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import Card from './components/card';
import './App.css';
import { sounds } from './utils/audioutils';
import K2SDK from '@dat-platform/k2-adserving';
import RcModal from './elements/RcModal';
import { getRewardsBalance } from './libs/ApiEndpoints';

const CARD_PAIRS = 6;
const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭'];

function App() {
  const [cards, setCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // Add this to prevent multiple clicks
  const [offers, setOffers] = useState([]);
  const [ads, setAds] = useState([]);
  const [modalType, setModalType] = useState(null)
  const [openModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const publisherId = "123";
  const user_id = "umcgxsi5zrsm7d8tkgp";
  const [userId, setUserId] = useState(user_id)
  const [rewardDetails, setRewardDetails] = useState({})
  const [rewardsBal, setRewardsBal] = useState('')

  useEffect(() => {
    WebApp.ready();
    initializeGame();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        await K2SDK.initialize({
          apiKey: "EjJvklHA2dq00xGJRuRa5QCr96dUAkdbJyxuixQ21ADYGcCeJT5LuDf2thVDlaLl"
        });
        // K2SDK.getID()
        // setUserId(K2SDK.getID())
        setTimeout(() => {
          getUserRewardsBalance();
        }, 500);
        return true;
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initialize();
  }, []);

  // Add useEffect to watch matchedPairs
  useEffect(() => {
    if (matchedPairs === CARD_PAIRS) {
      handleGameComplete();
    }
  }, [matchedPairs]);
  // Add console logs to debug
  useEffect(() => {
    console.log('Current matched pairs:', matchedPairs);
    console.log('Total pairs needed:', CARD_PAIRS);
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




  const handleRestart = () => {
    initializeGame();
  };

  const createConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const getOffers = async () => {
    try {
      setIsLoading(true)
      const sdk = K2SDK.getInstance();
      // Fetch offers
      const offerWall = await sdk.getOfferWall(publisherId, { limit: 100, user_unique_id: 12345678 });
      setOffers(offerWall);
      setIsLoading(false)
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  const getAd = async () => {
    setIsLoading(true)
    // Fetch display ads
    const sdk = K2SDK.getInstance();
    const displayAds = await sdk.getAd("123");
    setAds(displayAds.ads);
    setIsLoading(false)
  }

  const getUserRewardsBalance = async () => {
    // Fetch user rewards
    const sdk = K2SDK.getInstance();
    const rewardRes = await sdk.getRewardBalance();
    if (rewardRes && rewardRes.status == 200) {
      const rDetails = rewardRes.results
      setRewardDetails(rDetails)
      setRewardsBal(`${rDetails.reward_balance} ${rDetails?.reward_currency ?? ''}`)
    }
  }

  const showModal = async (modalName = null, data = null) => {
    if (modalName == null) {
      return false
    }
    let dataObj = data || {}
    switch (modalName) {
      case 'offerwall_modal':
        getOffers();
        if (data != null) {
          setModalData(data)
        }
        setModalType(modalName)
        setShowModal(true)
        break;
    }
  }

  const hideModal = (data = null) => {
    setModalData({})
    setModalType(null)
    setShowModal(false)
  }

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
        <h1>DAT Platform Memory Game</h1>
        <div>
          <h6>🔥 Special Offers Just for You! 🔥</h6>
        </div>
        <a className='offers_link' onClick={() => showModal('offerwall_modal')}>
          Show Offer wall
        </a>
        <div className="my-2">
            <span className="">
              {WebApp.initDataUnsafe?.user?.username || 'Player'} ⚡
            </span>
          </div>
        <div className='d-flex align-items-center justify-content-start position-relative'>
          <p className='fs-12 mb-0'>Total Rewards: <span className='fw-600'>{rewardsBal}</span></p>
          <span className='fs-24 fw-600 link_url position-absolute reward_pt' onClick={() => getUserRewardsBalance()}>&#10226;</span>
        </div>
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

      {(() => {
        if (modalType && modalType != '' && modalType != null) {
          if (modalType == "offerwall_modal") {
            return (
              <RcModal
                show={openModal}
                modalType={modalType}
                hideModal={hideModal}
                modalData={{ ...modalData, offers: offers, isLoading: isLoading, getUserRewardsBalance }}
              />
            );
          }
        }
      })()}
    </div>
  );
}

export default App;