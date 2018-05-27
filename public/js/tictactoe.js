'use strict';

// Variables declaration
let socket = io.connect();
let counter = 0;


/*********** SOCKET FUNCTION : THE BOARD ***********/
socket.on("initBoard", function () {
  /*********** CLASS SQUARE ***********/
  function Square(content) {
    this.content = "";
  }

  // Change mark automatically
  Square.prototype.whoseTurn = function() {
    if (counter == 0) {
      return this.content = "x";
    }
    else {
      return this.content = "o";
    }
  }

  /*********** CLASS BOARD ***********/
  function Board(grid) {
    this.grid = [
      [new Square(), new Square(), new Square()],
      [new Square(), new Square(), new Square()],
      [new Square(), new Square(), new Square()]
    ];
  }

  Board.prototype.isFull = function() {
    let count = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j].content != "") { 
          count++;
        }
      }
    }

    if (count == 9) {
      return true;
    }
    else {
      return false;
    }
  }

  Board.prototype.checkWin = function() {
    for (let k = 0; k < 3; k++) {
      if (this.grid[k][0].content == this.grid[k][1].content && this.grid[k][0].content == this.grid[k][2].content && this.grid[k][0].content != "") {
        currentGame.printWinner();
      }
    }

    for (let l = 0; l < 3; l++) {
      if (this.grid[0][l].content == this.grid[1][l].content && this.grid[0][l].content == this.grid[2][l].content && this.grid[0][l].content != "") {
        currentGame.printWinner();
      }
    }

    if ((this.grid[0][0].content == this.grid[1][1].content && this.grid[0][0].content == this.grid[2][2].content && this.grid[0][0].content != "") ||
      (this.grid[0][2].content == this.grid[1][1].content && this.grid[0][2].content == this.grid[2][0].content && this.grid[0][2].content != "")) {
      currentGame.printWinner();
    }

    if (this.isFull()) {
      currentGame.printTie();
    }
  }

  /*********** CLASS PLAYER ***********/
  function Player(mark) {
    this.mark = mark;
  }

  /*********** CLASS GAME ***********/
  function Game(board, players) {
    this.board = new Board();
    // initialize players
    this.players = [
      new Player("x"),
      new Player("o")
    ];
  }

  Game.prototype.printWinner = function() {
    let winner = this.players[counter].mark;
    alert(winner + " a gagné !");
  }

  Game.prototype.printTie = function() {
    alert("Match nul");
  }

  // Allow player to play again
  Game.prototype.playAgain = function() {
    let newGameButton = document.getElementById("new-game");

    newGameButton.addEventListener("click", () => {
      for (let m = 0; m < 9; m++) {
        document.querySelectorAll('.square')[m].innerHTML = "";
      }
      currentGame = new Game();
    });
  }

  // Create an instance for new game
  let currentGame = new Game();
  let currentBoard = document.getElementById("board");

  // Handle event click
  currentBoard.addEventListener("click", (event) => {
    event.target.innerHTML = currentGame.players[counter].mark;

    let squareNum = event.target.id.split('');
    let row = squareNum[0];
    let col = squareNum[1];

    // Verify each time if win and turn
    currentGame.board.grid[row][col].whoseTurn();
    currentGame.board.checkWin();

    if (counter == 0) { 
      counter = 1;
    }
    else {
      counter = 0;
    }
  });

  currentGame.playAgain();
});


/*********** SOCKET FUNCTION : THE CHAT ***********/
socket.on("chatMessages", function (msg) {
  $("#messages").append($("<li>").text(msg));
});

$(document).ready(function () {
  // CHAT MESSAGES
  $("form").submit(function () {
    let message = $("#m");
    socket.emit("chat", message.val());
    message.val("");
    return false;
  });
});
