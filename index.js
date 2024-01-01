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

const PlayerConstructor = (name, flag) => {
  if (verifyFlag(flag)) return { name, flag };
  throw TypeError("flag can only be assigned '0' or 'x' ");
};
