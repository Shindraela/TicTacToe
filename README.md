# Project : TicTacToe

Tictactoe with ES5 Javascript, Node.js, Socket.io and express.js

## Getting Started
To run the project, go into the folder then run "node app.js". To run specific js file:
- tictactoe.js: comment in html all the code above <!-- tictactoe2.js --> and before the
closure of body, comment the script source with tictactoe2.js
- tictactoe2.js: comment in html all the code above <!-- tictactoe.js --> and before the
closure of body, comment the script source with tictactoe.js

## Built With
* [node.js](https://nodejs.org/en/) - Javascript execution environment on server side
* [socket.io](https://socket.io/) - Library which allows synchronous communication 
* [express.js](http://expressjs.com/fr/) - Framework for building web applications

## Architecture
Tictactoe is build with the object oriented approach. There are two versions: tictactoe.js & tictactoe2.js.
- tictactoe.js: build without alternately notion between players. The Square class handles changes for mark,
the Player class handles the mark type, the Board class handles the events on grid, and the Game class handles
the interaction with the grid.
- tictactoe2.js: build more with Socket.io, just Board class for handling all the interactions with grid,
and the Player class for mark type and current turn parameter.

App.js initialize the board in socket.connection, communicate with the functions in tictactoe.js, and keep every
connection of users in list. A chat is also available.

## Authors
**Farooq Asmaa**

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details