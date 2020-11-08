import { Socket } from 'socket.io';
import { GameClient } from './game-client';

declare const socket: Socket;

const gameClient = new GameClient(socket);

gameClient.animate();

gameClient.addCook();
gameClient.addFurniture();
gameClient.addStock();

const clickOn = (selectors: string, listener: EventListener) => {
  const element = document.querySelector(selectors);
  if (element) {
    element.addEventListener('click', listener);
  }
}

clickOn('#addCookButton', () => {
  gameClient.addCook();
});

clickOn('#addStockButton', () => {
  gameClient.addStock();
});

clickOn('#addFurnitureButton', () => {
  gameClient.addFurniture();
});

['I1', 'I2', 'I4', 'I6', 'I7'].forEach((kind, i) => {
  const menu = document.querySelector('#menu');
  if (menu) {
    const id = `addIngredient${i}`;
    menu.insertAdjacentHTML(
      'afterbegin',
      `<div>
        <button id="${id}">+ ${kind}</button>
      </div>`
    );
    clickOn(`#${id}`, () => {
      gameClient.addIngredient(kind);
    });
  }
});

clickOn('#askFor', () => {
  // const inputElement = document.querySelector('#askForInput') as HTMLInputElement;
  // const data = Proportions.ParseProportionsInput(inputElement.value);
  socket.emit('addJob', 'I9');
});
