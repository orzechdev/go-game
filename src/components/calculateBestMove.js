import { evaluateBoard } from "./boardStateEvaluation";
import { isFieldSurroundedByJustOneColor, isGameFinished, checkFinalPoints } from "./boardFinishEvaluation";
import { colors } from "./boardConsts";
import { checkCurrentPoints, isFieldSurroundedByNothing } from "./boardCurrentEvaluation";

/**
 * Returns object with outcome, x and y where player should set stone 
 * to potentially obtain best results calculated by min-max algorithm 
 */
export const calculateMinMaxMove = (currValues, playerColor, depth = 1) => {
  return calculateBestMove(currValues, playerColor, depth * 2)
}

/**
 * It gives best (max) new values (worst for opponent)
 */
const calculateBestMove = (currValues, playerColor, depthIteration) => {
  const movesOutcomes = calculateMovesOutcomes(currValues, playerColor, depthIteration)

  // console.log('ACHTUNG BEST');
  // console.log(movesOutcomes);//{outcome: -1000, y: 5, x: 5}//

  const bestRowResult = movesOutcomes.map(row => 
    row.reduce((prev, current) => 
      (prev.outcome > current.outcome) ? prev : current
    )
  )

  const bestResult = bestRowResult.reduce((prev, current) => 
    (prev.outcome > current.outcome) ? prev : current
  );

  return bestResult;
}
/**
 * It gives worst (min) new values (best for opponent)
 */
const calculateWorstCountermove = (currValues, playerColor, depthIteration) => {
  const movesOutcomes = calculateMovesOutcomes(currValues, playerColor, depthIteration)

  // console.log('ACHTUNG WORST');
  // console.log(movesOutcomes);//{outcome: -1000, y: 5, x: 5}//

  const worsrRowCounterresult = movesOutcomes.map(row =>
    row.reduce((prev, current) => 
      (prev.outcome < current.outcome) ? prev : current
    )
  );

  // console.log('ACHTUNG 2');
  // console.log(worsrRowCounterresult);//{outcome: -1000, y: 5, x: 5}//

  const worstCounterresult = worsrRowCounterresult.reduce((prev, current) => 
    (prev.outcome < current.outcome) ? prev : current
  );

  // console.log('ACHTUNG 3');
  // console.log(worstCounterresult);//{outcome: -1000, y: 5, x: 5}//

  return worstCounterresult;
}

/**
 * It calculates possible values with their outcomes for player
 */
const calculateMovesOutcomes = (currValues, playerColor, depthIteration) => {
  let movesOutcomes = [
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
  ];

  for (let y = 0; y < currValues.length; y++) {
    for (let x = 0; x < currValues[y].length; x++) {
      const val = currValues[y][x];
      // It would be better to parallelize it...
      movesOutcomes[y][x] = calculateMoveMaxMinOutcome(currValues, playerColor, val, y, x, depthIteration)
    }
  }

  return movesOutcomes
}

const calculateMoveMaxMinOutcome = (currValues, playerColor, val, y, x, depthIteration) => {
  let newValues = currValues.map(arr => arr.slice())

  if (val === 0 && !isFieldSurroundedByNothing(newValues, y, x) && !isFieldSurroundedByJustOneColor(newValues, val, y, x)) {
    return calculateMoveMaxOutcome(newValues, playerColor, y, x, depthIteration)
  } else {
    if (isEvenIteration(depthIteration)) {
      return {outcome: -1000, y: y, x: x}
    } else {
      return {outcome: 1000, y: y, x: x}
    }
  }
}

const calculateMoveMaxOutcome = (newValues, playerColor, y, x, depthIteration) => {
  newValues[y][x] = playerColor

  // Evaluate new board
  let [currentValuesChanged, evaluatedValues] = evaluateBoard(newValues)
  if (currentValuesChanged) {
    newValues = evaluatedValues
  }

  if (isGameFinished(newValues)) {
    /**
     * Calculate final points at which the game will stopped
     */
    const [whitePoints, blackPoints] = checkFinalPoints(newValues)
    const currentPoints = playerColor === whitePoints ? whitePoints : blackPoints;
    const opponentPoints = playerColor === whitePoints ? blackPoints : whitePoints;
    const points = evaluatePoints(currentPoints, opponentPoints);
    
    return {outcome: points, y: y, x: x}
  }

  if (depthIteration <= 1) {

    /**
     * Check points in current game tree state, i.e. this time when game is not yet in end state, but depth of calculations is reached
     */
    const [whitePoints, blackPoints] = checkCurrentPoints(newValues)
    const currentPoints = playerColor === whitePoints ? whitePoints : blackPoints;
    const opponentPoints = playerColor === whitePoints ? blackPoints : whitePoints;
    const points = evaluatePoints(currentPoints, opponentPoints);

    return {outcome: points, y: y, x: x}
  }
  
  // Use this evaluated new board and calculate another set of move max outcomes for opponent, then take min from that set of opponent's outcomes 
  if (isEvenIteration(depthIteration)) {
    const newDepthIteration = depthIteration - 1;
    const opponentColor = playerColor === colors.WHITE ? colors.BLACK : colors.WHITE
    const calculatedNextMove = calculateWorstCountermove(newValues, opponentColor, newDepthIteration)
    return {outcome: calculatedNextMove.outcome, y: y, x: x}
  } else {
    const newDepthIteration = depthIteration - 1;
    const currentColor = playerColor === colors.WHITE ? colors.BLACK : colors.WHITE
    const calculatedNextMove = calculateBestMove(newValues, currentColor, newDepthIteration);
    return {outcome: calculatedNextMove.outcome, y: y, x: x}
  }
}

/**
 * Evaluate points from the current player perspective - if higher its better, if lower then its worse
 */
const evaluatePoints = (currentPoints, opponentPoints) => {
  return currentPoints - opponentPoints;
}

const isEvenIteration = (n) => {
  return n % 2 == 0;
}