import { Socket } from 'socket.io';
import { GameClient } from './game-client';
import { Proportions } from '../../domain/proportions';
declare const socket: Socket;

const gameClient = new GameClient(socket);

gameClient.animate();

const random = (size: number) => size * (2 * Math.random() - 1);

const clickOn = (selectors: string, listener: EventListener) => {
  const element = document.querySelector(selectors);
  if (element) {
    element.addEventListener('click', listener);
  }
}

clickOn('#addCookButton', () => {
  socket.emit('addItemHolder', 'c', random(100), random(100), 1 + 9 * Math.random());
});

clickOn('#addStockButton', () => {
  socket.emit('addItemHolder', 's', random(100), random(100));
});

clickOn('#addFurnitureButton', () => {
  socket.emit('addItemHolder', 'f', random(100), random(100));
});

clickOn('#addIngredient1', () => {
  socket.emit('addItemsIn', gameClient.getSelectedEntityUuids(), 'I1');
});

clickOn('#addIngredient2', () => {
  socket.emit('addItemsIn', gameClient.getSelectedEntityUuids(), 'I2');
});

clickOn('#addIngredient3', () => {
  socket.emit('addItemsIn', gameClient.getSelectedEntityUuids(), 'I3');
});

clickOn('#addIngredient4', () => {
  socket.emit('addItemsIn', gameClient.getSelectedEntityUuids(), 'I4');
});

clickOn('#askFor', () => {
  // const inputElement = document.querySelector('#askForInput') as HTMLInputElement;
  // const data = Proportions.ParseProportionsInput(inputElement.value);
  socket.emit('addJob', 'I5');
});
