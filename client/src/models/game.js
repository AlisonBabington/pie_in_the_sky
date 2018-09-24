const PubSub = require('../helpers/pub_sub.js');
const Board = require('./board.js');
const Player = require('./player.js');
const Card = require('./card.js');

const Game = function (player1, player2, board) {
  this.player1 = player1;
  this.player2 = player2;
  this.board = board;
  this.currentPlayer = null;
  this.currentCategory = null;
};

Game.prototype.startGame = function () {
  this.currentPlayer = this.player1;
  this.playTurn();
  PubSub.subscribe(`Card:is-correct`, (event => {
    const result = event.detail;
    this.checkResult(result)
  }))
};

Game.prototype.playTurn = function () {
  PubSub.subscribe('Player:rollnumber', (event => {
  const moves = event.detail;
  this.board.movesPlayer(this.currentPlayer, moves);
}));

};

Game.prototype.checkResult = function (result) {
  if (result === false) {
    this.endTurn();
  }
  else {
    this.currentPlayer.score += 1;
    this.playTurn();
  }
};

Game.prototype.endTurn = function () {

  if (this.currentPlayer.name === this.player1.name) {
    this.currentPlayer = this.player2;
    console.log(this.player2);
  }
  else {
    this.currentPlayer = player1;
  };
  this.playTurn();
};


module.exports = Game;
