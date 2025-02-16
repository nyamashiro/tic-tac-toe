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
  }

  const placeMark = (row, col, mark) => {
    if (row >= rows || board[row][col] === undefined) {
      return
    } else if (!!board[row][col]) {
      return
    } else {
      board[row][col] = mark;
      return true
    }
  }

  const checkWinnerMark = (mark, name) => {
    switch (mark) {
      case "X":
        return true;
      case "O":
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

  const newGame = () => {
    board.resetBoard()
    gameOver = false;
    activePlayer = players[0]
  }

  const isGameOver = () => gameOver;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const setPlayerNames = function () {
    const playerNames = document.querySelectorAll("input")
    for (let i = 0; i < 2; i++) {
      let customName = playerNames[i].value;
      players[i].name = customName;
    }
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (row, col) => {
    if (gameOver) {
      return; // Do nothing if the game is over
    }
    let playerMove = board.placeMark(row, col, getActivePlayer().mark)


    if (board.checkWinner(getActivePlayer().name) && board.checkWinner(getActivePlayer().name) !== "tie") {
      gameOver = "winner";
      return;
    } else if (board.checkWinner(getActivePlayer().name) === "tie") {
      gameOver = "tie";
    } else {
      if (playerMove === undefined) {
        return;
      } else {
        switchPlayerTurn();
        return true;
      }
    }
  }

  return { playRound, getActivePlayer, newGame, getBoard: board.getBoard, isGameOver, setPlayerNames }
}

const displayController = function () {

  const gameBoard = gameController();
  const playerDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const container = document.querySelector(".container");
  const dialog = document.querySelector("dialog");

  const renderBoard = function () {
    const board = gameBoard.getBoard();
    boardDiv.textContent = "";

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
      renderRestartButton();
    } else if (gameBoard.isGameOver() === "tie") {
      renderTie();
      renderPlayerMark(targetRow, targetCell, currentPlayerMark);
      renderRestartButton();
    }
  })

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("restart")) {
      resetGame(gameBoard.getActivePlayer().name)
    }

    if (e.target.classList.contains("start")) {
      dialog.showModal();
    }

    if (e.target.classList.contains("button")) {
      const form = document.querySelector("form");
      if (!form.checkValidity()) {
        return
      }
      e.preventDefault();
      startGame();
    }
  })

  const resetGame = function (name) {
    const restart = document.querySelector(".restart")
    gameBoard.newGame();
    container.removeChild(restart)
    boardDiv.textContent = "";
    playerDiv.textContent = "";
    renderStartButton();
  }

  const startGame = function() {
    if (document.querySelector(".start")) {
      const start = document.querySelector(".start");
      container.removeChild(start)
    }
    gameBoard.setPlayerNames();
    dialog.close();
    renderBoard();
    renderInitialPlayerName();
  }

  const renderInitialPlayerName = function () {
    let activePlayer = gameBoard.getActivePlayer();
    playerDiv.textContent = "";
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
    tie.textContent = "It's a tie! No one wins";
    playerDiv.appendChild(tie)
  }

  const renderRestartButton = function () {
    const restart = document.createElement("button");
    restart.classList.add("restart");
    restart.textContent = "Reset game";
    container.appendChild(restart)
  }

  const renderStartButton = function () {
    if (!document.querySelector(".start")) {
      const start = document.createElement("button");
      start.classList.add("start");
      start.textContent = "Start game";
      container.appendChild(start);
    }
  }
  renderStartButton();
}

displayController();