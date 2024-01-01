const verifyFlag = (f) => flag + "" == "0" || flag.toLowerCase() === "x";

const gameBoard = (() => {
  const grid = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];
  let noOfFilledCells = 0;
  const getGrid = () => grid;
  const updateGrid = (flag, rindex, cindex) => {
    if (noOfFilledCells === 9) return "full";
    if (
      verifyFlag(flag) &&
      rindex >= 0 &&
      rindex < 3 &&
      cindex >= 0 &&
      cindex < 3 &&
      grid[rindex][cindex] === undefined
    ) {
      grid[rindex][cindex] = flag;
      noOfFilledCells++;
      return "empty";
    } else if (!verifyFlag(flag))
      throw TypeError("Please check the value for flag parameter");
    else if (rindex >= 0 && rindex < 3)
      throw TypeError(
        "Please check the value for rindex  parameter or other player has already put his/her flag at given grid position"
      );
    else if (cindex >= 0 && cindex < 3)
      throw TypeError("Please check the value for cindex parameter");
    else
      throw TypeError(
        "Other player has already put his/her flag at given cell position"
      );
  };
  const getNoOfFilledCells = () => noOfFilledCells;
  return { getGrid, updateGrid, getNoOfFilledCells };
})();

const Player = (name, flag) => {
  if (verifyFlag(flag)) return { name, flag };
  throw TypeError("Flag can be assigned '0' or 'x' ");
};

const gameStatus = (() => {
  let lineAllignedCells = undefined;
  let winnerPlayer = undefined;
  let PlayerNoWithTurn = 1;
  const getPlayerWithTurn = () => {
    return PlayerNoWithTurn;
  };
  const setPlayerWithTurn = () => {
    PlayerNoWithTurn = 1 + (PlayerNoWithTurn % 2);
  };
  const getStraightAllignedFlaggedCells = (grid, flag) => {
    if (verifyFlag(flag)) {
      flag = (flag + "").toLowerCase();
      if (grid[0][0] === g[1][1] && g[1][1] === g[2][2] && grid[2][2] === flag)
        lineAllignedCells = [
          [0, 0],
          [1, 1],
          [2, 2],
        ];
      else if (
        grid[0][2] === g[1][1] &&
        g[1][1] === g[2][0] &&
        grid[2][0] === flag
      )
        lineAllignedCells = [
          [0, 2],
          [1, 1],
          [2, 0],
        ];
      else {
        for (let i = 0; i < 3; i++) {
          if (
            grid[i][0] === g[i][1] &&
            g[i][1] === g[i][2] &&
            grid[i][2] === flag
          )
            lineAllignedCells = [
              [i, 0],
              [i, 1],
              [i, 2],
            ];
          else if (
            grid[0][i] === g[1][i] &&
            g[1][i] === g[2][i] &&
            grid[2][i] === flag
          )
            lineAllignedCells = [
              [0, i],
              [1, i],
              [2, i],
            ];
        }
        lineAllignedCells = null;
      }
    } else throw TypeError("Flag can be assigned '0' or 'x'");
  };
  const isGameOver = (player1, player2, gameBoard) => {
    let gameBoardGrid = gameBoard.getGrid();
    if (gameBoardGrid.getNoOfFilledCells() < 5) return false;

    getStraightAllignedFlaggedCells(player1.flag, gameBoardGrid);
    if (lineAllignedCells !== null) {
      winnerPlayer = player1;

      return true;
    } else {
      getStraightAllignedFlaggedCells(player2.flag, gameBoardGrid);
      winnerPlayer =
        lineAllignedCells !== null
          ? player2
          : gameBoard.getNoOfFilledCells() === 9
          ? null
          : undefined;

      return winnerPlayer !== undefined;
    }
  };
  const getLineAllignedCells = () => lineAllignedCells;
  const getWinner = (player1, player2, gameBoard) => {
    const gameOverStatus = isGameOver(player1, player2, gameBoard);
    if (gameOverStatus) return winnerPlayer;
    else throw TypeError("Game is not over yet");
  };
  return {
    isGameOver,
    getWinner,
    getPlayerWithTurn,
    setPlayerWithTurn,
    getLineAllignedCells,
  };
})();

// executes the game from getting user names and flag they like to use (0 or x) to declaring winner
const gameEngine = () => {
  const user1Name = prompt("Enter your name", "user1");
  if (user1Name === null) return;
  const user1Flag = prompt("Enter the flag you want (0 or X)", "0");

  const user2Name = prompt("Enter your name", "user2");
  if (user2Name === null) return;
  let user2Flag = user1Flag === "0" ? "x" : "0";
  const Player1 = Player(user1Name, user1Flag);
  const Player2 = Player(user1Name, user2Flag);
  let PlayerWithTurn;
  while (!gameStatus.isGameOver(Player1, Player2, gameBoard)) {
    if (gameStatus.getPlayerWithTurn() === 1) {
      PlayerWithTurn = Player1;
    } else PlayerWithTurn = Player2;
    let rindex = parseInt(
      prompt(
        `${PlayerWithTurn.name} enter the cell 's row number where you want to mark ${PlayerWithTurn.flag} (indexes starts form  0)`
      ) ?? -1
    );
    let cindex = parseInt(
      prompt(
        `${PlayerWithTurn.name} enter the cell 's column number where you want to mark ${PlayerWithTurn.flag} (indexes starts form  0)`
      ) ?? -1
    );
    if (rindex === -1 || cindex === -1) {
      alert(
        "You entered the wrong row or column now game terminates.Restart the game by refreshing"
      );
      return;
    }
    gameBoard.updateGrid(PlayerWithTurn.flag, rindex, cindex);

    gameStatus.setPlayerWithTurn();
  }
  const winner = gameStatus.getWinner(Player1, Player2, gameBoard);
  const LineAllignedCells = gameStatus.getLineAllignedCells();
  if (winner === null) {
    alert("The game is draw");
  } else {
    alert(`The game is won by ${winner.name} with ${winner.flag} flag`);
    console.log(LineAllignedCells, " Cells ");
  }
};
