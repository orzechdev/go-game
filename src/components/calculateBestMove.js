import { evaluateBoard } from "./boardStateEvaluation";
import { isFieldSurroundedByJustOneColor } from "./boardFinishEvaluation";

/**
 * It gives best (min-max) new values
 */
export const calculateBestMove = (currValues, playerColor) => {
  const movesOutcomes = calculateMovesOutcomes(currValues, playerColor)

  const newValues = movesOutcomes.reduce((prev, current) => 
    (prev.outcome > current.outcome) ? prev : current
  ).values;

  return newValues;
}

/**
 * It calculates possible values with their outcomes for player
 */
const calculateMovesOutcomes = (currValues, playerColor) => {
  let movesOutcomes;

  for (let y = 0; y < currValues.length; y++) {
    for (let x = 0; x < currValues[y].length; x++) {
      const val = currValues[y][x];
      // It would be better to parallelize it...
      movesOutcomes[y][x] = calculateMoveMaxMinOutcome(currValues, playerColor, val, y, x)
    }
  }

  return movesOutcomes
}

const calculateMoveMaxMinOutcome = (currValues, playerColor, val, y, x) => {
  let newValues = currValues.map(arr => arr.slice())

  if (val === 0 && !isFieldSurroundedByJustOneColor(newValues, val, y, x)) {
    return calculateMoveMaxOutcome(newValues, playerColor, val, y, x)
  } else {
    return {outcome: 0, values: newValues}
  }
}

const calculateMoveMaxOutcome = (newValues, playerColor, val, y, x) => {
  newValues[y][x] = playerColor

  // Evaluate new board
  let [currentValuesChanged, evaluatedValues] = evaluateBoard(newValues)

  // Use this evaluated new board and calculate another set of move max outcomes for opponent, then take min from that set of opponent's outcomes 
  // TODO

  return {outcome: 0, values: newValues}
}

// const calculateMoveMinOutcome = (currValues) => {
//   let newValues = currValues.map(arr => arr.slice())

//   return {outcome: 0, values: newValues}
// }
