import App from "../../app";
import { showModal } from "./modal";
import { createElement } from "../../helpers/domHelper";
export function showWinnerModal(fighter) {
  const attributes = {src: `${fighter.source}`}
  const bodyElement = createElement({tagName: 'img', className: 'won_fighter', attributes});
  showModal({title: `WON ${fighter.name}`, bodyElement, onClose: () => {
    App.startApp();
  }})
  // call showModal function 
}
