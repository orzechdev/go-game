/* eslint-disable no-console */

import { direction } from "./boardConsts";

export const evaluateBoard = (newValues, boardSize) => {
  let valuesWereChanged = false;
  let valuesAreChanged = false;
  // Opponent values might be surrounded in more then one place, thus need to be calculated as much time as possible
  do {
    valuesAreChanged = false;
    // Iterate over the whole board
    for (let y = 0; y < boardSize; y++) {
      const row = newValues[y];
      let isChanged = false;
      for (let x = 0; x < boardSize; x++) {
        const val = row[x];
        if (val != 0) {
          let [currentValuesChanged, evaluatedValues] = evaluateCurrentValue(newValues, val, y, x, boardSize)
          isChanged = currentValuesChanged;
          // console.log(currentValuesChanged)
          if (currentValuesChanged) {
            valuesWereChanged = true;
            valuesAreChanged = true;
            newValues = evaluatedValues;
            // return [true, evaluatedValues] // temp....
            break;
          }
        }          
      }
      if (isChanged) {
        break;
      }
    }
  } while (valuesAreChanged)
  return [valuesWereChanged, newValues]
}

/**
 * Check if the current stone in given place is surrounded by opponent's stones
 */
const evaluateCurrentValue = (newValues, val, yVal, xVal, boardSize) => {
  const opponentColor = val === 1 ? 2 : 1;
  let valuesAreChanged = false;
  // let checkedValues = [
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  // ]
  // Chack top
  if (yVal != 0) {
    if (newValues[yVal-1][xVal] === opponentColor) {
      // console.log(`p 1 val:${val} yVal:${yVal} xVal:${xVal}`)
      let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal-1, xVal, direction.BOTTOM, boardSize)
      if (isSorrounded) {
        valuesAreChanged = true;
        // console.log('pass 1')
        newValues = obtainedValues;
      }
    }
  }
  // Check right
  if (xVal !== boardSize-1) {
    if (newValues[yVal][xVal+1] === opponentColor) {
      // console.log(`p 2 val:${val} yVal:${yVal} xVal:${xVal}`)
      let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal, xVal+1, direction.LEFT, boardSize)
      if (isSorrounded) {
        valuesAreChanged = true;
        // console.log('pass 2')
        newValues = obtainedValues;
      }
    }
  }
  // Check bottom
  if (yVal !== boardSize-1) {
    if (newValues[yVal+1][xVal] === opponentColor) {
      // console.log(`p 3 val:${val} yVal:${yVal} xVal:${xVal}`)
      let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal+1, xVal, direction.TOP, boardSize)
      if (isSorrounded) {
        valuesAreChanged = true;
        // console.log('pass 3')
        newValues = obtainedValues;
      }
    }
  }
  // Check left
  if (xVal != 0) {
    if (newValues[yVal][xVal-1] === opponentColor) {
      // console.log(`p 4 val:${val} yVal:${yVal} xVal:${xVal}`)
      let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal, xVal-1, direction.RIGHT, boardSize)
      if (isSorrounded) {
        valuesAreChanged = true;
        // console.log('pass 4')
        newValues = obtainedValues;
      }
    }
  }
  // Resluting Values after current value is placed
  return [valuesAreChanged, newValues]; 
}

// If it will be refactored, probably possible to remove prevDirection and use just checkedValues
const evaluateOpponentValue = (newValues, val, yVal, xVal, prevDirection, boardSize, checkedValuesMap) => {
  if (!checkedValuesMap)
    checkedValuesMap = Array.from({length: boardSize}, () => Array(boardSize).fill(0));
  // let checkedValuesMap = [
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  // ]//checkedValues.map(arr => arr.slice());
  checkedValuesMap[yVal][xVal] = 1;

  const opponentColor = val === 1 ? 2 : 1;
  // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection}`)
  let evaluatedValues = newValues.map(arr => arr.slice());

  // Chack top
  if (yVal != 0 && prevDirection !== direction.TOP && checkedValuesMap[yVal-1][xVal] != 1) {
    // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 1`)
    if (evaluatedValues[yVal-1][xVal] === opponentColor) {
      let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal-1, xVal, direction.BOTTOM, boardSize, checkedValuesMap.map(arr => arr.slice()))
      if (!isSorrounded) {
        return [false, newValues];
      }
      evaluatedValues = obtainedValues;
      checkedValuesMap = checkedValuesObtained;
    } else if (evaluatedValues[yVal-1][xVal] === 0) {
      return [false, newValues];
    }
  }
  // Check right
  if (xVal !== boardSize-1 && prevDirection !== direction.RIGHT && checkedValuesMap[yVal][xVal+1] != 1) {
    // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 2`)
    if (evaluatedValues[yVal][xVal+1] === opponentColor) {
      let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal, xVal+1, direction.LEFT, boardSize, checkedValuesMap.map(arr => arr.slice()))
      if (!isSorrounded) {
        return [false, newValues];
      }
      evaluatedValues = obtainedValues;
      checkedValuesMap = checkedValuesObtained;
    } else if (evaluatedValues[yVal][xVal+1] === 0) {
      return [false, newValues];
    }
  }
  // Check bottom
  if (yVal !== boardSize-1 && prevDirection !== direction.BOTTOM && checkedValuesMap[yVal+1][xVal] != 1) {
    // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 3`)
    if (evaluatedValues[yVal+1][xVal] === opponentColor) {
      let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal+1, xVal, direction.TOP, boardSize, checkedValuesMap.map(arr => arr.slice()))
      if (!isSorrounded) {
        return [false, newValues];
      }
      evaluatedValues = obtainedValues;
      checkedValuesMap = checkedValuesObtained;
    } else if (evaluatedValues[yVal+1][xVal] === 0) {
      return [false, newValues];
    }
  }
  // Check left
  if (xVal != 0 && prevDirection !== direction.LEFT && checkedValuesMap[yVal][xVal-1] != 1) {
    // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 4`)
    if (evaluatedValues[yVal][xVal-1] === opponentColor) {
      let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal, xVal-1, direction.RIGHT, boardSize, checkedValuesMap.map(arr => arr.slice()))
      if (!isSorrounded) {
        return [false, newValues];
      }
      evaluatedValues = obtainedValues;
      checkedValuesMap = checkedValuesObtained;
    } else if (evaluatedValues[yVal][xVal-1] === 0) {
      return [false, newValues];
    }
  }
  // If opponent is surrounded
  evaluatedValues[yVal][xVal] = 0;
  // console.log(evaluatedValues)
  return [true, evaluatedValues, checkedValuesMap];
}
