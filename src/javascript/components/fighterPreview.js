import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (typeof fighter !== 'undefined') {
    //block 1 ==========================================
    const healthElement = createElement({tagName: 'div', className: `fighter-preview___heart`});
    const nameElement = createElement({tagName: 'div',className: `fighter-preview___name`});
    const blockWrapper = createElement({tagName: 'div', className: 'wrapper'});
    const bar = createElement({tagName: 'div',className: `bar`,});
    blockWrapper.append(healthElement, nameElement); 
    //==================================================
    //block 2 ==========================================
    const blockInfo = createElement({tagName: 'div', className: 'info'});
    const health = createElement({tagName: 'div', className: 'info__health item'});
    const attack = createElement({tagName: 'div', className: 'info__attack item'});
    const defense = createElement({tagName: 'div', className: 'info__defense item'});
    blockInfo.append(health, attack, defense); 
    health.innerHTML  = ` &#x2764; ${fighter.health}`;
    attack.innerHTML  = `Attack - ${fighter.attack}`;
    defense.innerHTML  = `Defense - ${fighter.defense}`;

//==================================================
    
    const imgElement = createFighterImage(fighter);
    try {
      healthElement.append(bar)
      nameElement.innerText = fighter.name
    } catch (error) {
      
    }
  fighterElement.append(imgElement);
  fighterElement.insertBefore(blockWrapper, imgElement)
  fighterElement.insertBefore(blockInfo, imgElement)
    // todo: show fighter info (image, name, health, etc.)

    return fighterElement;
  }
  
}

export function createFighterImage(fighter) {
  try {
  const { source, name } = fighter;
  const attributes = { 
    src: source , 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
    
  } catch (error) {
    
  }
  
}
