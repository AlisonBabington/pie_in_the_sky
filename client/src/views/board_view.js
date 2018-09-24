const createAndAppend = require('../helpers/create_append');
const PubSub = require('../helpers/pub_sub.js');
const Player = require('../models/player.js');

const BoardView = function (game) {
  this.game = game;
  this.player1Piece = null;
  this.player2Piece = null;
}

BoardView.prototype.bindEvents = function () {
  const start = document.querySelector('#space0');
  const dieButton = document.querySelector('#dieButton');
  dieButton.addEventListener('click', function () {
    const player = new Player('');
    player.rollDie();
  })

  this.player1Piece = createAndAppend('div', 'playerPiece', 'player1', '', start)
  this.player2Piece = createAndAppend('div', 'playerPiece', 'player2', '', start)
  this.movePlayer();
  this.printNumber();
};

BoardView.prototype.movePlayer = function () {
    PubSub.subscribe('Board:move-player', (evt) => {

      const player = evt.detail;
      const pieceName = evt.detail.name;
      const position = `#space${evt.detail.position}`
      const start = `#space${evt.detail.endTurnPosition}`;
      const place = document.querySelector(start)
      const piece = document.querySelector(`#${pieceName}`)
      place.removeChild(piece)
      document.querySelector(position).appendChild(piece);
      document.querySelector(position)
    });
    PubSub.subscribe('Board:final-position', (evt) => {
      const position = `#space${evt.detail}`;
      const square = document.querySelector(position);
      const category =  square.classList.value;
      PubSub.publish('BoardView:category', category);
    });

};

//die in board view
BoardView.prototype.printNumber = function () {
  PubSub.subscribe('Player:rollnumber', (evt) => {
  const number = evt.detail;
  const roller = document.querySelector('#diePlace');
  roller.innerHTML = number;
 })
};

// var button = document.getElementById('button');
//
// button.onclick = function() {
//   var result = dice.roll();
//   printNumber(result);
// };



module.exports = BoardView;
