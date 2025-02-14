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

  const renderBoard = () => {
    // function logic goes here
    console.log("board is rendered")
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
      return true;
    }
  }

  return { getBoard, resetBoard, renderBoard, placeMark, checkWinner }

})();

function gameController(
  playerOne = "Player 1",
  playerTwo = "Player 2"
) {
  const board = game;

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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (row, col) => {

    let playerMove = board.placeMark(row, col, getActivePlayer().mark)


    if (board.checkWinner(getActivePlayer().name)) {
      console.log("Would you like to play a new game?")
      return;
    } else {
      if (playerMove === undefined) {
        console.log(`It is still ${getActivePlayer().name}'s turn`)
      } else {
        switchPlayerTurn();
        console.log(`It is ${getActivePlayer().name}'s turn`)
      }
    }
  }

  return { playRound, getActivePlayer, newGame }
}

const start = gameController();