const game = (function gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  //creating the 3x3 2d array as the board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("")
    }
  }

  const getBoard = () => board.map(row => [...row]);

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push("")
      }
    }
    console.log(getBoard());
  }

  const placeMark = (row, col, mark) => {
    if (row >= rows || board[row][col] === undefined) {
      console.log("invalid move, cell does not exist")
      console.log(getBoard())
      return
    } else if (!!board[row][col]) {
      console.log("invalid move, cell already occupied")
      console.log(getBoard())
      return
    } else {
      board[row][col] = mark;
      console.log(getBoard())
      return true
    }
  }

  const checkWinnerMark = (mark, name) => {
    switch (mark) {
      case "X":
        console.log(`${name} is the winner`)
        return true;
      case "O":
        console.log(`${name} is the winner`)
        return true;
      default:
        return;

    }
  }

  const checkWinner = (name) => {
    let cell1;
    let cell2;
    let cell3;

    //check if any rows have won
    for (let row of getBoard()) {
      if (row[0] === row[1] && row[1] === row[2]) {
        return checkWinnerMark(row[0], name)
      }
    }

    //check if any columns have won
    for (let i = 0; i < 3; i++) {
      cell1 = getBoard()[0][i];
      cell2 = getBoard()[1][i];
      cell3 = getBoard()[2][i];
      if (cell1 === cell2 && cell2 === cell3) {
        return checkWinnerMark(cell1, name)
      }
    }

    //check if any diagonals have won
    if ((getBoard()[0][0] === getBoard()[1][1] && getBoard()[1][1] === getBoard()[2][2])) {
      return checkWinnerMark(getBoard()[0][0], name)
    }
    if ((getBoard()[0][2] === getBoard()[1][1] && getBoard()[1][1] === getBoard()[2][0])) {
      return checkWinnerMark(getBoard()[0][2], name)
    }

    //check for tie 
    if (getBoard().flat().every(cell => !!cell)) {
      console.log("It's a tie!")
      return "tie";
    }
  }

  return { getBoard, resetBoard, placeMark, checkWinner }

})();

const gameController = function (
  playerOne = "Player 1",
  playerTwo = "Player 2"
) {
  const board = game;
  let gameOver = false;

  const players = [{
    name: playerOne,
    mark: "X"
  },
  {
    name: playerTwo,
    mark: "O"
  }]

  let activePlayer = players[0];

  const newGame = (choice = false) => {
    if (choice) {
      board.resetBoard()
      activePlayer = players[0]
      console.log(`It is ${getActivePlayer().name}'s turn`)
    } else {
      return;
    }
  }

  const isGameOver = () => gameOver;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (row, col) => {
    if (gameOver) {
      return; // Do nothing if the game is over
    }
    let playerMove = board.placeMark(row, col, getActivePlayer().mark)


    if (board.checkWinner(getActivePlayer().name) && board.checkWinner(getActivePlayer().name) !== "tie") {
      console.log("Would you like to play a new game?")
      gameOver = "winner";
      return;
    } else if (board.checkWinner(getActivePlayer().name) === "tie") {
      console.log("TIEE")
      gameOver = "tie";
    } else {
      if (playerMove === undefined) {
        console.log(`It is still ${getActivePlayer().name}'s turn`)
        return;
      } else {
        switchPlayerTurn();
        console.log(`It is ${getActivePlayer().name}'s turn`)
        return true;
      }
    }
  }

  return { playRound, getActivePlayer, newGame, getBoard: board.getBoard, switchPlayerTurn, isGameOver }
}

const displayController = function () {

  const gameBoard = gameController();
  const playerDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");


  const renderBoard = function () {
    const board = gameBoard.getBoard();

    board.forEach((row, i) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i
        cellButton.dataset.cell = index
        boardDiv.appendChild(cellButton);
      })
    })
  }

  boardDiv.addEventListener("click", (e) => {
    if (gameBoard.isGameOver()) {
      return;
    }

    let targetRow = e.target.dataset.row;
    let targetCell = e.target.dataset.cell;

    let currentPlayerMark = gameBoard.getActivePlayer().mark
    let currentPlayer = gameBoard.getActivePlayer().name;

    let playerMove = gameBoard.playRound(targetRow, targetCell)

    if (playerMove) {
      renderActivePlayerName();
      renderPlayerMark(targetRow, targetCell, currentPlayerMark);
    } else if (gameBoard.isGameOver() === "winner") {
      renderWinner(currentPlayer);
      renderPlayerMark(targetRow, targetCell, currentPlayerMark);
    } else if (gameBoard.isGameOver() === "tie") {
      renderTie();
      renderPlayerMark(targetRow, targetCell, currentPlayerMark);
    }
  })


  const renderInitialPlayerName = function () {
    let activePlayer = gameBoard.getActivePlayer();
    const player = document.createElement("h2");
    player.classList.add("player");
    player.textContent = `It is ${activePlayer.name}'s turn`;
    playerDiv.appendChild(player);

  }

  const renderActivePlayerName = function () {
    let activePlayer = gameBoard.getActivePlayer();
    let activePlayerRender = document.querySelector("h2")
    activePlayerRender.textContent = `It is ${activePlayer.name}'s turn`;
  }

  const renderPlayerMark = function (row, cell, mark) {
    const playerCell = document.querySelector(`[data-row="${row}"][data-cell="${cell}"]`)
    playerCell.textContent = mark
  }

  const renderWinner = function (name) {
    const winner = document.querySelector("h2");
    winner.textContent = `${name} is the winner!`
    playerDiv.appendChild(winner)
  }

  const renderTie = function () {
    const tie = document.querySelector("h2");
    tie.textContent = "It's a tie! No one wins :(";
    playerDiv.appendChild(tie)
  }


  renderBoard();
  renderInitialPlayerName();

}

const start = gameController();

displayController();