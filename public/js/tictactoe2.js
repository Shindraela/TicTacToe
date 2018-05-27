'use strict';

// Variables declaration
let socket = io.connect();
let currentGame;
let counter = 0;
let player;
let firstPlayer = "x";
let secondPlayer = "o";


/*********** CLASS BOARD ***********/
function Board() {
  this.grid = [];
  this.squares = 0;
}

/*********** CLASS PLAYER ***********/
function Player(mark) {
  this.mark = mark;
  this.currentTurn = true;
}


/*********** SOCKET FUNCTION ***********/
socket.on("initBoard", function () {
  currentGame = new Board();
  player = new Player(firstPlayer);
  let currentBoard = document.getElementById("board");

  /***** BOARD PROTOTYPES *****/
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

  Board.prototype.createCurrentBoard = function() {
    for(let k = 0; k < 3; k++) {
      this.grid.push(["","",""]);

      for (let l = 0; l < 3; l++) {
        $("#btn_" + k + "" + l).on("click", function() {
          //Check for turn
          /*if(!player.getCurrentTurn()) {
            alert("Its not your turn!");
            return;
          }*/

          //Update board after your turn.
          let row = parseInt(this.id.split("_")[1][0]);
          let col = parseInt(this.id.split("_")[1][1]);
          
          currentGame.playTurn(this);
          console.log("type mark :", player.getCurrentMark(), row, col);
          currentGame.updateBoard(player.getCurrentMark(), row, col, this.id);

          player.setCurrentTurn(false);

          //game.checkWinner();

          return false;

        });
      }
    }

    console.log("this.grid :", this.grid);
  }

  Board.prototype.checkWin = function() {
    for (let k = 0; this.grid.length; k++) {
      for (let l = 0; this.grid[k].length; l++) {
        if (this.grid[k][0] == this.grid[k][1] && this.grid[k][0] == this.grid[k][2] && this.grid[k][0] != "") {
          //currentGame.printWinner();
        }
        if (this.grid[0][l] == this.grid[1][l] && this.grid[0][l] == this.grid[2][l] && this.grid[0][l] != "") {
          //currentGame.printWinner();
        }
        if ((this.grid[0][0] == this.grid[1][1] && this.grid[0][0] == this.grid[2][2] && this.grid[0][0] != "") ||
          (this.grid[0][2] == this.grid[1][1] && this.grid[0][2] == this.grid[2][0] && this.grid[0][2] != "")) {
          //currentGame.printWinner();
        }
      }
    }
  }

  // Update the board with the current mark in grid
  Board.prototype.updateBoard = function(mark, row, col, square) {
    $('#'+square).text(mark);
    this.grid[row][col] = mark;
    this.squares ++;
  }

  // Change turn
  Board.prototype.playTurn = function(square) {
    let clickedSquare = $(square).attr("id");
    let turnObj = {
      square: clickedSquare
    };
    // Emit an event to update other player that you've played your turn.
    socket.emit("playTurn", turnObj);
  }

  // Print the winner with his mark
  Board.prototype.printWinner = function() {
    let winner = player.getCurrentMark();
    console.log(winner, "wins !");
  }

  Board.prototype.printTie = function() {
    console.log("It's a tie");
  }

  // Allow player to play again
  Board.prototype.playAgain = function() {
    let newGameButton = document.getElementById("new-game");

    newGameButton.addEventListener("click", () => {
      for (let m = 0; m < 9; m++) {
        document.querySelectorAll('.square')[m].innerHTML = "";
      }
      currentGame = new Board();
    });
  }

  /***** PLAYER PROTOTYPES *****/
  Player.prototype.getCurrentTurn = function() {
    return this.currentTurn;
  }

  Player.prototype.setCurrentTurn = function(currentTurn) {
    this.currentTurn = currentTurn;

    /*if(currentTurn) {
      $("#message").text("Your turn.");
    } else {
      $("#message").text("Waiting for Opponent");
    }*/
  }

  Player.prototype.getCurrentMark = function() {
    return this.mark;
  }

  // Event listener onclick which create the board + check if win
  currentBoard.addEventListener("click", (event) => {
    currentGame.checkWin();
    currentGame.createCurrentBoard();

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

// Joined the game, where player is second player
socket.on("secondPlayer", function(data) {
  console.log("data :", data);
  //Create game for second player
  currentGame = new Board(data);
  player = new Player(secondPlayer);
  // First turn is of player 1, so set to false
  player.setCurrentTurn(false);
});

// Change text when second player come in game
socket.on("startGame", function (start) {
  if (start) {
    $("body").html("<p class='start'>Partie commencée</p>");
  }
});

// Opponent played his turn. Update UI
socket.on("turnPlayed", function(data) {
  console.log("data turnPlayed :", data);
  let row = data.square.split("_")[1][0];
  let col = data.square.split("_")[1][1];
  //let opponentType = player.getCurrentMark() == firstPlayer ? secondPlayer : firstPlayer;

  //currentGame.updateBoard(opponentType, row, col, data.square);
  player.setCurrentTurn(true);
});
