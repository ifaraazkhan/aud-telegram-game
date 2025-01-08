// At the top of audioutils.js, import the sound files
import flipSound from '../assets/sound/flip.mp3';
import matchSound from '../assets/sound/match.mp3';
import victorySound from '../assets/sound/victory.mp3';

// Then use the imported variables
export const sounds = {
  flip: new Audio(flipSound),
  match: new Audio(matchSound),
  victory: new Audio(victorySound)
};

// Adjust volumes
sounds.flip.volume = 0.3;
sounds.match.volume = 0.4;
sounds.victory.volume = 0.5;