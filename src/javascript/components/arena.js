import { createElement } from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import { getDamage } from './fight';
import { controls } from '../../constants/controls';

export function renderArena(selectedFighters) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);
  
  root.innerHTML = '';
  root.append(arena);
  // todo:
  const leftBlockButtons = createButtons('left', '<span>A</span> &#xa0; - shock', '<span>D</span> &#xa0;  - protection', '<span>Z</span> &#xa0;  - left', '<span>C</span> &#xa0; - right', `<span>Q + W + E</span><span class="progress"></span>`);
  const rightBlockButtons = createButtons('right', '<span>J</span> &#xa0; - shock', '<span>L</span> &#xa0;  - protection', '<span>&#x21e6;</span> &#xa0; - left', '<span>&#x21e8;</span> &#xa0; - right', '<span>U + I + O</span><span class="progress"></span></span>');
  document.querySelectorAll('.arena___fighter-indicator')[0].append(leftBlockButtons);
  document.querySelectorAll('.arena___fighter-indicator')[1].append(rightBlockButtons);
  const [firstFighter, secondFighter] = selectedFighters; 
  fight(firstFighter, secondFighter).then

  // - start the fight
  // - when fight is finished show winner
}

function createArena(selectedFighters) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);
  leftRight(fighters, arena, selectedFighters, healthIndicators)//my
  arena.append(healthIndicators, fighters);
  return arena;
}
//my code ******************************************
const distance = new Map(); 
const calcDistance = new Map(); 
function leftRight(parent, appendElement, selectedFighters,healthIndicators) {
  const distanceForBattleElement = createElement({ tagName: 'div', className: 'distance_for-battle-element' });
  const calcHealthLeft = 100 / selectedFighters[0].health;

  appendElement.append(distanceForBattleElement);

  parent.childNodes.forEach(item => {
    move(item,distanceForBattleElement )
    attackAndDefense(item, selectedFighters, healthIndicators, calcHealthLeft, appendElement)
  })
 }

 function move(nodeElem, distanceForBattleElement) {
  
  const widthDocument = document.documentElement.clientWidth; 
  let shiftLeft = 0, 
      shiftRight = 0,
      okFirstLeft = false, 
      okFirstRight = false, 
      okLastLeft = false, 
      okLastRight = false; 
      setInterval(() => {
      calcDistance.set('distance', widthDocument - (distance.get('distanceLeft') + distance.get('distanceRight'))) 
      if(okFirstLeft) {
        if(nodeElem.getBoundingClientRect().right < widthDocument) {
          shiftLeft += 20; 
          nodeElem.style.transform = 'scaleX(1)'; 
        }
        nodeElem.style.left = `${shiftLeft}px`; 
      }
      if(okFirstRight) {
        if(nodeElem.getBoundingClientRect().x > 0) {
          nodeElem.style.transform = 'scaleX(-1)';
          shiftLeft -= 20; 
        } 
        nodeElem.style.left = `${shiftLeft}px`; 
      }

      if(okLastLeft) {
        if(nodeElem.getBoundingClientRect().x > 0){
          shiftRight -= 20; 
          nodeElem.style.transform = 'scaleX(1)'; 
        }
        nodeElem.style.left = `${shiftRight}px`;
      }
      if(okLastRight) {
        if(nodeElem.getBoundingClientRect().right < widthDocument) {
          shiftRight += 20; 
          nodeElem.style.transform = 'scaleX(-1)';
        }  
        nodeElem.style.left = `${shiftRight}px`;
      }
      if (calcDistance.get('distance') < 100 && calcDistance.get('distance') > -500) {
        distanceForBattleElement.innerText = 'can';
        distanceForBattleElement.style.backgroundColor = 'green';
        }else {
        distanceForBattleElement.innerText = 'far'
        distanceForBattleElement.style.backgroundColor = 'red';
      }
    }, 10)
  window.addEventListener('keydown', (e) => {
    nodeElem.style.position = 'relative';
    if(nodeElem.classList.contains('arena___left-fighter')) { 
      
      distance.set('distanceLeft', nodeElem.getBoundingClientRect().right)

      if(e.code == 'KeyC') {
        okFirstLeft = true; 
      }else if (e.code == 'KeyZ'){
        okFirstRight = true; 
      }
    }
    if(nodeElem.classList.contains('arena___right-fighter')) {
      distance.set('distanceRight', widthDocument - nodeElem.getBoundingClientRect().x )
        

      if(e.code == 'ArrowRight') {
        okLastRight = true;   
      }else if (e.code == 'ArrowLeft'){
        okLastLeft =  true; 
      } 
    }
    
    
  })
  window.addEventListener('keyup', (e) => {
    okFirstLeft = false;
    okFirstRight = false;
    okLastLeft = false;
    okLastRight = false; 
  })
}












 function attackAndDefense (nodeElem, fighter, parentInd, coefficient, appendElement) {
  const progressLeft = createElement({tagName: 'div', className: 'progress_status_left'});
  const progressRight = createElement({tagName: 'div', className: 'progress_status_right'});
  appendElement.append(progressLeft, progressRight)
  let blockFirstFighters = false, 
      blockLastFighters = false,
      superHitStatusLeft = true,
      superHitStatusRight = true;

      function superHitAttack (hitFunc, position,  ...codes) {
        
        let pressed = new Set();
        document.addEventListener('keydown', function(event) {
          pressed.add(event.code);
      
          for (let code of codes) { 
            if (!pressed.has(code)) {
              return;
            }
          }
          pressed.clear();
          if(position == 'left')  {
            if (calcDistance.get('distance') < 100 && calcDistance.get('distance') > -500) {
            
              if(superHitStatusLeft) {
                setTimeout(() => {
                  superHitStatusLeft = true;
                  progressRight.style.backgroundColor = `green`;
                }, 10000)
                
                superHitStatusLeft = false;
                progressRight.style.backgroundColor = `red`;
                hitFunc(); 
              }
            }
          }
          if(position == 'right')  {
            if (calcDistance.get('distance') < 100 && calcDistance.get('distance') > -500) {
            
              if(superHitStatusRight) {
                setTimeout(() => {
                  superHitStatusRight = true;
                  progressLeft.style.backgroundColor = `green`;
                }, 10000)
                hitFunc(); 
                superHitStatusRight = false;
                progressLeft.style.backgroundColor = `red`;
              }
            }
          }
          
        });
      
        document.addEventListener('keyup', function(event) {
          pressed.delete(event.code);
          
        });
      }

      superHitAttack(() => hitLeft(), 'left', 'KeyQ', 'KeyW', 'KeyE'); 
      superHitAttack(() => hitRight(), 'right', 'KeyU', 'KeyI', 'KeyO')

      function hitLeft() {
          fighter[1].health -= 2 * fighter[0].attack;
          nodeElem.classList.add('active'); 
              setTimeout(() => {
                nodeElem.classList.remove('active'); 
              },200)
        
      }
      function hitRight() {
        fighter[0].health -= 2 * fighter[0].attack;
        nodeElem.classList.add('active'); 
            setTimeout(() => {
              nodeElem.classList.remove('active'); 
            },200)
      }


  window.addEventListener('keydown', (e) => {
   
    if (calcDistance.get('distance') < 100 && calcDistance.get('distance') > -500) {
      if(nodeElem.classList.contains('arena___left-fighter')) {
     
        if(e.code === 'KeyA') {
          nodeElem.classList.add('active'); 
            setTimeout(() => {
              nodeElem.classList.remove('active'); 
            },100)
          if(blockFirstFighters === false && blockLastFighters === false) {
            getDamage(fighter[0], fighter[1])
            fighter[1].health -= getDamage(fighter[0], fighter[1]); 
          } 
          
        }
        
      }
      if(nodeElem.classList.contains('arena___right-fighter')) {
  
        if(e.code === 'KeyJ') {
          nodeElem.classList.add('active__left'); 
            setTimeout(() => {
              nodeElem.classList.remove('active__left'); 
            },50);

          if(blockFirstFighters === false && blockLastFighters === false) {
            fighter[0].health -= getDamage(fighter[1], fighter[0]);  
          }           
        }
      }
      }
    if (e.code === 'KeyL'){
      blockLastFighters = true; 
      if(nodeElem.classList.contains('arena___right-fighter')) {
        nodeElem.style.borderLeft = '1px solid red'; 
        nodeElem.style.borderRight = '1px solid red'; 
        nodeElem.style.boxShadow = '0px 0px 40px -1px red'; 
      }
    }
    if (e.code === 'KeyD'){
      blockFirstFighters = true;
      if(nodeElem.classList.contains('arena___left-fighter')) {
        nodeElem.style.borderLeft = '1px solid red'; 
        nodeElem.style.borderRight = '1px solid red'; 
        nodeElem.style.boxShadow = '0px 0px 40px -1px red'; 
      }
    }
    
    parentInd.querySelector('#right-fighter-indicator').style.width = `${coefficient * fighter[1].health}%`;
    parentInd.querySelector('#left-fighter-indicator').style.width = `${coefficient * fighter[0].health}%`;

    if(fighter[0].health < 0) {
      parentInd.querySelector('#left-fighter-indicator').style.width = `0%`
    }
    if(fighter[1].health < 0) {
      parentInd.querySelector('#right-fighter-indicator').style.width = `0%`
    }
  })
  window.addEventListener('keyup', (e) => {
    if (e.code == 'KeyL'){
      blockLastFighters = false; 
      if(nodeElem.classList.contains('arena___right-fighter')) {
        nodeElem.style.borderLeft = 'none'; 
        nodeElem.style.borderRight = 'none'; 
        nodeElem.style.boxShadow = 'none'; 
      }
    }
    if (e.code == 'KeyD'){
      if(nodeElem.classList.contains('arena___left-fighter')) {
        nodeElem.style.borderLeft = 'none'; 
        nodeElem.style.borderRight = 'none'; 
        nodeElem.style.boxShadow = 'none'; 
      }
      blockFirstFighters = false;
    }
    
  })
  
 }

 function createButtons(position, shockBtn, protectionBtn, leftBtn, rightBtn, superHitBtn) {
  //createBlock====================
  const blockLeft = createElement({tagName: 'div', className: `block-${position}__wrapper`});
  //===============================

  //createButtons==================
  const shockButton = createElement({tagName: 'div', className: `block-${position}__wrapper_shockBtn btn`});
  const protectionButton = createElement({tagName: 'div', className: `block-${position}__wrapper_protectionBtn btn`});
  const leftButton = createElement({tagName: 'div', className: `block-${position}__wrapper_leftBtn btn`});
  const rightButton = createElement({tagName: 'div', className: `block-${position}__wrapper_rightBtn btn`});
  const superHit = createElement({tagName: 'div', className: `block-${position}__wrapper_superHit btn`});
  //=============================

  shockButton.innerHTML = shockBtn;
  protectionButton.innerHTML = protectionBtn;
  leftButton.innerHTML = leftBtn;
  rightButton.innerHTML = rightBtn;
  superHit.innerHTML = superHitBtn;

  blockLeft.append(shockButton, protectionButton, leftButton, rightButton, superHit);

  function onKeyLeft (superHit, position, ...codes) {
    let pressed = new Set();
    document.addEventListener('keydown', function(event) {
      pressed.add(event.code);

      for (let code of codes) { 
        if (!pressed.has(code)) {
          return;
        }
      }
      pressed.clear();
      if(position == 'left') {
        superHit.style.border = '5px solid red';
      }
    });

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.code);
      if(position == 'left') {
        superHit.style.border = 'none';
      }
    });

  }
  function onKeyRight (superHit, position, ...codes) {
    let pressed = new Set();

    document.addEventListener('keydown', function(event) {
      pressed.add(event.code);

      for (let code of codes) { 
        if (!pressed.has(code)) {
          return;
        }
      }
      pressed.clear();
    if(position == 'right') {
      superHit.style.border = '5px solid red';
      return true;
    }
    });

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.code);
      if(position == 'right') {
        superHit.style.border = 'none';
      }
    });

  }
  onKeyLeft(superHit, position,  'KeyQ', 'KeyW', 'KeyE');
  onKeyRight(superHit, position, 'KeyU', 'KeyI', 'KeyO');
  
  window.addEventListener('keydown', (e) => {

    if(e.code === 'KeyA' && position == 'left') {
      shockButton.style.border = '5px solid red';
    }else if(e.code === 'KeyD' && position == 'left') {
      protectionButton.style.border = '5px solid red';
    }else if(e.code === 'KeyZ' && position == 'left') {
      leftButton.style.border = '5px solid red';
    }else if(e.code === 'KeyC' && position == 'left') {
      rightButton.style.border = '5px solid red';
    } 

    

    if(e.code === 'KeyJ' && position == 'right') {
      shockButton.style.border = '5px solid red';
    }else if(e.code === 'KeyL' && position == 'right') {
      protectionButton.style.border = '5px solid red';
    }else if(e.code === 'ArrowLeft' && position == 'right') {
      leftButton.style.border = '5px solid red';
    }else if(e.code === 'ArrowRight' && position == 'right') {
      rightButton.style.border = '5px solid red';
    }else if (e.code ==='KeyU' && e.code === 'KeyI' && e.code === 'KeyO') {
      superHit.style.border = '5px solid red';
    }
  });
  window.addEventListener('keyup', (e) => {
    if(e.code === 'KeyA' && position == 'left') {
      shockButton.style.border = 'none';
    }else if(e.code === 'KeyD' && position == 'left') {
      protectionButton.style.border = 'none';
    }else if(e.code === 'KeyZ' && position == 'left') {
      leftButton.style.border = 'none';
    }else if(e.code === 'KeyC' && position == 'left') {
      rightButton.style.border = 'none';
    }else if (e.code ==='KeyQ' && e.code === 'KeyW' && e.code === 'KeyW' && position == 'left') {
      superHit.style.border = 'none';
    }

    if(e.code === 'KeyJ' && position == 'right') {
      shockButton.style.border = 'none';
    }else if(e.code === 'KeyL' && position == 'right') {
      protectionButton.style.border = 'none';
    }else if(e.code === 'ArrowLeft' && position == 'right') {
      leftButton.style.border = 'none';
    }else if(e.code === 'ArrowRight' && position == 'right') {
      rightButton.style.border = 'none';
    }else if (e.code ==='KeyU' && e.code === 'KeyI' && e.code === 'KeyO' && position == 'right') {
      superHit.style.border = 'none';
    }
  });

  return blockLeft; 
 }
//******************************************
function createHealthIndicators(leftFighter, rightFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

  function createHealthIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${position}-fighter-indicator` }});

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter, secondFighter) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(firstFighter, 'left');
  const secondFighterElement = createFighter(secondFighter, 'right');

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter, position) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}
