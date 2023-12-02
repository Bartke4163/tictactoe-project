const GameBoard = (() => {
  const cellElements = document.querySelectorAll('[data-cell]');
  const board = document.querySelector('#board');

  function clearBoard() {
    cellElements.forEach((cell) => {
      cell.classList.remove('x', 'circle');
    });
  }

  function addCellClickListener(handleClick) {
    cellElements.forEach((cell) => {
      cell.addEventListener('click', handleClick, { once: true });
    });
  }

  function setBoardHoverClass(circleTurn) {
    board.classList.remove('x', 'circle');
    board.classList.add(circleTurn ? 'circle' : 'x');
  }

  function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
  }

  return {
    cellElements,
    clearBoard,
    addCellClickListener,
    setBoardHoverClass,
    placeMark,
  };
})();

const GameLogic = (() => {
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin(currentClass, cellElements) {
    return WINNING_COMBINATIONS.some((combination) => {
      return combination.every((index) => {
        return cellElements[index].classList.contains(currentClass);
      });
    });
  }

  function isDraw(cellElements) {
    return [...cellElements].every((cell) => {
      return cell.classList.contains('x') || cell.classList.contains('circle');
    });
  }

  return {
    checkWin,
    isDraw,
  };
})();

const GameController = (() => {
  const Game = {
    X_CLASS: 'x',
    CIRCLE_CLASS: 'circle',
    circleTurn: false,
    pOneName: '',
    pTwoName: '',
  };
  const winningMessageElement = document.querySelector('#winningMessage');
  const turn = document.querySelector('#turn');
  const playerOne = document.querySelector('.player1');
  const playerTwo = document.querySelector('.player2');

  function playerTurn() {
    Game.circleTurn === true
      ? (turn.textContent = `${Game.pTwoName}\'s turn`)
      : (turn.textContent = `${Game.pOneName}\'s turn`);
  }

  function startGame() {
    if (playerOne.value === '' || playerTwo.value === '') {
      return;
    }
    Game.pOneName =
      playerOne.value.charAt(0).toUpperCase() + playerOne.value.slice(1);
    Game.pTwoName =
      playerTwo.value.charAt(0).toUpperCase() + playerTwo.value.slice(1);
    num = Math.floor(Math.random() * 2);
    Game.circleTurn = num === 0 ? false : true;
    playerTurn();
    GameBoard.clearBoard();
    GameBoard.addCellClickListener(handleClick);
    GameBoard.setBoardHoverClass(Game.circleTurn);
    winningMessageElement.classList.remove('show');
  }

  function endGame(draw) {
    const winningMessageTextElement = document.querySelector(
      '[data-winning-message-text]'
    );

    if (draw) {
      winningMessageTextElement.innerText = 'Draw';
    } else {
      winningMessageTextElement.innerText = `${
        Game.circleTurn ? `${Game.pTwoName} Wins` : `${Game.pOneName} Wins`
      }`;
    }
    winningMessageElement.classList.add('show');
  }

  function handleClick(e) {
    const cell = e.target;
    const currentClass = Game.circleTurn ? Game.CIRCLE_CLASS : Game.X_CLASS;
    GameBoard.placeMark(cell, currentClass);
    if (GameLogic.checkWin(currentClass, GameBoard.cellElements)) {
      endGame(false);
    } else if (GameLogic.isDraw(GameBoard.cellElements)) {
      endGame(true);
    } else {
      Game.circleTurn = !Game.circleTurn;
      GameBoard.setBoardHoverClass(Game.circleTurn);
      playerTurn();
    }
  }

  const restartBtn = document.querySelectorAll('#restartButton');
  restartBtn.forEach((button) => {
    button.addEventListener('click', startGame);
  });

  const startBtn = document.querySelector('#startButton');
  startBtn.addEventListener('click', startGame);

  return {
    startGame,
  };
})();
