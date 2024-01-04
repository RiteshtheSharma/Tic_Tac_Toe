const verifyFlag = (f) => f + "" == "0" || f.toLowerCase() === "x";

// UI part

const DomElements = (() => {
  const DialogDomElement = document.querySelector("dialog#user_ip_dialog");
  const DialogFormSubmitBtnElement = DialogDomElement.querySelector("button");
  const GameStatusElement = document.querySelector("caption p.status");
  const TableBodyElement = document.querySelector("tbody");
  return {
    DialogDomElement,
    DialogFormSubmitBtnElement,
    TableBodyElement,
    GameStatusElement,
  };
})();

const UserIPDialogController = ((DialogDomElement) => {
  const dialogElement = DialogDomElement;
  const user1nameIPElement = dialogElement.querySelector("#user1name"),
    user2nameIPElement = dialogElement.querySelector("#user2name"),
    flagIPElement = dialogElement.querySelector("#user1flag");
  let user1name, user2name, flag1, flag2;
  const invokeDialog = () => {
    dialogElement.showModal();
  };
  const getFormFieldValues = () => {
    return { user1name, user2name, flag1, flag2 };
  };
  const setFormValues = () => {
    user1name = user1nameIPElement.value + "";
    user2name = user2nameIPElement.value + "";
    flag1 = flagIPElement.value.toLowerCase();
    flag2 = flag1 === "0" ? "x" : "0";
    if (user1name.length === 0 || user2name.length === 0) {
      dialogElement.querySelector("form").classList.add("invalid");
      setTimeout(() => {
        dialogElement.querySelector("form").classList.remove("invalid");
      }, 2000);

      return null;
    }
    return { user1name, user2name, flag1, flag2 };
  };
  const closeDialog = () => {
    if (user1name.length > 0 && user2name.length > 0) {
      dialogElement.close();
      return true;
    }
    return false;
  };
  return { invokeDialog, getFormFieldValues, setFormValues, closeDialog };
})(DomElements.DialogDomElement);

const GameStatusDisplayController = ((GameStatusElement) => {
  const updateGameStatus = (text) => {
    GameStatusElement.firstChild.remove();
    GameStatusElement.innerText = "";
    const strongElement = document.createElement("strong");
    strongElement.appendChild(document.createTextNode("Game Status"));
    GameStatusElement.appendChild(strongElement);
    GameStatusElement.appendChild(document.createTextNode(" : " + text));
  };
  return { updateGameStatus };
})(DomElements.GameStatusElement);

const eventListenerInitializer = (
  { DialogFormSubmitBtnElement, TableBodyElement },
  updateGameOnUserMove,
  gameEngineInitializer,
  gameBoard
) => {
  DialogFormSubmitBtnElement.addEventListener("click", (e) => {
    e.preventDefault();
    UserIPDialogController.setFormValues();
    UserIPDialogController.closeDialog();
    gameEngineInitializer();
  });

  TableBodyElement.addEventListener("click", (e) => {
    const c = parseInt(e.target.className[1]),
      r = parseInt(e.target.parentElement.id[1]);
    if (e.target.innerText.length === 0) {
      updateGameOnUserMove(r, c);
      e.target.innerText = gameBoard.getGrid()[r][c];
    } else
      alert(
        "This row & column position is already occupied .Enter the inputs at different position"
      );
  });

  const documentEscapeKeyListener = document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        UserIPDialogController.setFormValues();
        UserIPDialogController.closeDialog();
      }
      gameEngineInitializer();
    }
  );
};

// non UI part

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
      throw TypeError(
        `Please check the value for flag parameter \n flag : ${flag}`
      );
    else if (!(rindex >= 0 && rindex < 3))
      throw TypeError(
        `Please check the value for rindex  parameter or other player has already put his/her flag at given grid position \n rindex : ${rindex}`
      );
    else if (!(cindex >= 0 && cindex < 3))
      throw TypeError(
        `Please check the value for cindex parameter \n cindex : ${cindex}`
      );
    else
      throw TypeError(
        `Other player has already put his/her flag at given cell position \n rindex : ${rindex} , cindex : ${cindex}`
      );
  };
  const getNoOfFilledCells = () => noOfFilledCells;
  return { getGrid, updateGrid, getNoOfFilledCells };
})();

const Player = (name, flag) => {
  if (verifyFlag(flag)) return { name, flag };
  throw TypeError(`Flag can be assigned '0' or 'x' \n flag : ${flag}`);
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
  const getStraightAllignedFlaggedCells = (flag, grid) => {
    if (verifyFlag(flag)) {
      flag = (flag + "").toLowerCase();
      if (
        grid[0][0] === grid[1][1] &&
        grid[1][1] === grid[2][2] &&
        grid[2][2] === flag
      )
        lineAllignedCells = [
          [0, 0],
          [1, 1],
          [2, 2],
        ];
      else if (
        grid[0][2] === grid[1][1] &&
        grid[1][1] === grid[2][0] &&
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
            grid[i][0] === grid[i][1] &&
            grid[i][1] === grid[i][2] &&
            grid[i][2] === flag
          ) {
            lineAllignedCells = [
              [i, 0],
              [i, 1],
              [i, 2],
            ];
            break;
          } else if (
            grid[0][i] === grid[1][i] &&
            grid[1][i] === grid[2][i] &&
            grid[2][i] === flag
          ) {
            lineAllignedCells = [
              [0, i],
              [1, i],
              [2, i],
            ];
            break;
          }
        }
        if (lineAllignedCells === undefined) lineAllignedCells = null;
      }
    } else throw TypeError(`Flag can be assigned '0' or 'x' \n flag : ${flag}`);
  };
  const isGameOver = (player1, player2, gameBoard) => {
    let gameBoardGrid = gameBoard.getGrid();
    if (gameBoard.getNoOfFilledCells() < 5) return false;

    getStraightAllignedFlaggedCells(player1.flag, gameBoardGrid);
    if (lineAllignedCells !== null) {
      winnerPlayer = player1;
      console.log("isGameOver", lineAllignedCells);
      return true;
    } else {
      getStraightAllignedFlaggedCells(player2.flag, gameBoardGrid);
      winnerPlayer =
        lineAllignedCells !== null
          ? player2
          : gameBoard.getNoOfFilledCells() === 9
          ? null
          : undefined;
      console.log("isGameOver", lineAllignedCells);
      return winnerPlayer !== undefined;
    }
  };
  const getLineAllignedCells = () => lineAllignedCells;
  const getWinner = (player1, player2, gameBoard) => {
    if(winnerPlayer !==undefined) return winnerPlayer ;
    const gameOverStatus = isGameOver(player1, player2, gameBoard);
    if (gameOverStatus) return winnerPlayer;
    else throw TypeError(`Game is not over yet \n gameBoard : ${gameBoard}`);
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
  UserIPDialogController.invokeDialog();
  let Player1, Player2, PlayerWithTurn;

  const updateUserTurn = () => {
    gameStatus.setPlayerWithTurn();
    PlayerWithTurn = gameStatus.getPlayerWithTurn() === 1 ? Player1 : Player2;
    GameStatusDisplayController.updateGameStatus(
      `${PlayerWithTurn.name} 's turn . Enter ${PlayerWithTurn.flag}`
    );
  };
  const initialize = () => {
    const { user1name, user2name, flag1, flag2 } =
      UserIPDialogController.getFormFieldValues();
    Player1 = Player(user1name, flag1);
    Player2 = Player(user2name, flag2);
    PlayerWithTurn = gameStatus.getPlayerWithTurn() === 1 ? Player1 : Player2;
    GameStatusDisplayController.updateGameStatus(
      `${PlayerWithTurn.name} 's turn . Enter ${PlayerWithTurn.flag}`
    );
  };
  const updateGameOnUserMove = (rindex, cindex) => {
    if (
      gameBoard.updateGrid(PlayerWithTurn.flag, rindex, cindex) !== "full" &&
      !gameStatus.isGameOver(Player1, Player2, gameBoard)
    )
      updateUserTurn();
    else {
      const winner = gameStatus.getWinner(Player1, Player2, gameBoard);
      const LineAllignedCells = gameStatus.getLineAllignedCells();
      if (winner === null) {
        GameStatusDisplayController.updateGameStatus("The game is draw");
      } else {
        GameStatusDisplayController.updateGameStatus(
          `The game is won by ${winner.name} with ${winner.flag} flag`
        );
        console.log(LineAllignedCells, " Cells ");
      }
      return false;
    }
    return true;
  };
  eventListenerInitializer(
    DomElements,
    updateGameOnUserMove,
    initialize,
    gameBoard
  );
};
gameEngine();
