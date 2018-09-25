const PubSub = require('../helpers/pub_sub.js');
const BoardMap = require('../helpers/board_map.js');
const Board = require('./board.js');
const Player = require('./player.js');
const Card = require('./card.js');
const Timer = require('./timer.js');

const categories = ['science', 'sports', 'movies', 'history', 'music', 'books'];
const Game = function (player1, player2, board) {
  this.player1 = player1;
  this.player2 = player2;
  this.board = board;
  this.currentPlayer = null;
  this.currentCategory = null;
  this.timer = null;
  // this.winSound = { url : "./sounds/win.mp3" };
};

Game.prototype.startGame = function () {
  this.currentPlayer = this.player1;
  this.timer = new Timer (70);
  this.timer.countdown();
  this.playTurn();
  PubSub.subscribe(`Card:is-correct`, (event) => {
    const result = event.detail;
    this.checkResult(result)
  })
  this.timerFinish();
};

Game.prototype.playTurn = function () {
  PubSub.subscribe('Player:rollnumber', (evt) => {
  const numberRolled = 'r' + evt.detail;
  const move_options = BoardMap[this.currentPlayer.position][numberRolled];
  PubSub.publish('Game:player-choose-move', [move_options, this.currentPlayer]);
  // this.board.movesPlayer(this.currentPlayer, moves);
});

};

Game.prototype.checkResult = function (result) {
  if (result.isCorrect === false) {
    this.endTurn();
  }
  else {
    const categoryIndex = categories.indexOf(result.category);
    this.currentPlayer.score.splice(categoryIndex, 1, 1);
    // console.log(this.currentPlayer.score);
    PubSub.publish('Game:score-change', this.currentPlayer.score);
  };
  const playerScore = this.currentPlayer.score.reduce((a, b) => a + b, 0);
  if (playerScore === 6) {
    this.endGame();
  }
};

Game.prototype.endTurn = function () {

  if (this.currentPlayer.name === this.player1.name) {
    this.currentPlayer = this.player2;
  }
  else {
    this.currentPlayer = this.player1;
  };
  this.timer.endTimer();
  this.timer = new Timer (70);
  this.timer.countdown();
  PubSub.publish('Game:current-player-change', this.currentPlayer);
};

Game.prototype.timerFinish = function () {
  PubSub.subscribe('Timer:currentTime', (evt) => {
    const time = evt.detail;
    if (time === 0 ) {
      this.endTurn();
    }
  });
};

Game.prototype.endGame = function () {
  PubSub.publish('Game:end-game', this);
  this.timer.endTimer();
  // playSound(this.winSound);
};


module.exports = Game;
