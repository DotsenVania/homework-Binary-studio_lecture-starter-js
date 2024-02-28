import { controls } from '../../constants/controls';
import { showWinnerModal } from './modal/winner';
export async function fight(firstFighter, secondFighter) {
 
  return new Promise((resolve) => {

   window.addEventListener('keydown', (e) => {
    if(firstFighter.health < 0 ) {
      resolve(secondFighter)
      showWinnerModal(secondFighter)
      firstFighter = {};
      secondFighter = {};
    }
    if(secondFighter.health < 0) {
      resolve(firstFighter)
      showWinnerModal(firstFighter)
      secondFighter = {};
      firstFighter = {};
    }
   })
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  const result = getHitPower(attacker) - getBlockPower(defender); 
  if(result > 0) {
    return result;
  }else {
    return 5; 
  }
  // return damage
}

export function getHitPower(fighter) {
  function criticalHitChance(min, max) {
    let rand = min + Math.random() * (max - min);
    return rand;
  }
  return fighter.attack * criticalHitChance(1, 2); 
  // return hit power
}

export function getBlockPower(fighter) {
  function dodgeChance (min, max) {
    let rand = min + Math.random() * (max - min);
    return rand;
  }
  return fighter.defense * dodgeChance(1, 2);
  // return block power
}
