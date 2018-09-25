const createAndAppend = require('../helpers/create_append');
const PubSub = require('../helpers/pub_sub.js');
const BoardMap = require('../helpers/board_map.js');
const Player = require('../models/player.js');

const BoardView = function (game) {
  this.game = game;
  this.player1Piece = null;
  this.player2Piece = null;
}

BoardView.prototype.bindEvents = function () {
  // const start = document.querySelector('#space0');
  const dieButton = document.querySelector('#dieButton');

  dieButton.addEventListener('click', () => {
    this.game.currentPlayer.rollDie();
    // player.rollDie();
    dieButton.disabled = true;
  });

  this.player1Piece = document.querySelector('#p1-piece');
  this.player2Piece = document.querySelector('#p2-piece');
  this.player3Piece = document.querySelector('#p3-piece');
  this.player4Piece = document.querySelector('#p4-piece');
  // this.movePlayer();
  this.printNumber();

      PubSub.subscribe('Board:player-move', (evt) => {

        this.game.currentPlayer.position = evt.detail;
        let activePiece = null;
        if (this.game.currentPlayer === this.game.player1) {
          this.player1Piece.style.left = BoardMap[evt.detail]['left']+4 + 'px';
          this.player1Piece.style.top = BoardMap[evt.detail]['top']+4 + 'px';
        } else if (this.game.currentPlayer === this.game.player2)  {
          this.player2Piece.style.left = BoardMap[evt.detail]['left']+42 + 'px';
          this.player2Piece.style.top = BoardMap[evt.detail]['top']+42 + 'px';
        } else if (this.game.currentPlayer === this.game.player3) {
          this.player3Piece.style.left = BoardMap[evt.detail]['left']+42 + 'px';
          this.player3Piece.style.top = BoardMap[evt.detail]['top']+4 + 'px';
        } else {
          this.player4Piece.style.left = BoardMap[evt.detail]['left']+4 + 'px';
          this.player4Piece.style.top = BoardMap[evt.detail]['top']+42 + 'px';
        };
        const category = document.querySelector(`#${evt.detail}`).classList.value;
        // console.log(category);
        PubSub.publish('BoardView:category', category);

      });

};


    //   const player = evt.detail;
    //   const pieceName = evt.detail.name;
    //   const position = `#space${evt.detail.position}`
    //   const start = `#space${evt.detail.endTurnPosition}`;
    //   const place = document.querySelector(start);
    //   const piece = document.querySelector(`#${pieceName}`);
    //   place.removeChild(piece)
    //   document.querySelector(position).appendChild(piece);
    //   document.querySelector(position);
    // });
    // PubSub.subscribe('Board:final-position', (evt) => {
    //   const position = `#space${evt.detail}`;
    //   const square = document.querySelector(position);
    //   const category =  square.classList.value;
    //   PubSub.publish('BoardView:category', category);
    // });

// };

//die in board view
BoardView.prototype.printNumber = function () {
  PubSub.subscribe('Player:rollnumber', (event) => {
    const number = event.detail;
    const roller = document.querySelector('#diePlace');
    roller.innerHTML = number;
  });
};

module.exports = BoardView;
