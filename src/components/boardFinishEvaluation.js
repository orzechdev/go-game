
/**
 * Check if game is finished
 */
export const isGameFinished = (newValues) => {
  for (let y = 0; y < newValues.length; y++) {
    const row = newValues[y];
    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      if (!isFieldDetermined(newValues, val, y, x)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if field has inserted stone or around are just one color stones
 */
export const isFieldDetermined = (newValues, val, yVal, xVal) => {
  // Check if is filled with any stone
  if (newValues[yVal][xVal] !== 0) {
    return true;
  }
  return isFieldSurroundedByJustOneColor(newValues, val, yVal, xVal)
}

export const isFieldSurroundedByJustOneColor = (newValues, val, yVal, xVal) => {
  let isNeighborChecked = false;
  let isWhiteNeighbor = false;
  let isBlackNeighbor = false;
  // Check top
  if (yVal != 0) {
    if (newValues[yVal-1][xVal] === 0) {
      return false;
    } else if (newValues[yVal-1][xVal] === 1) {
      isWhiteNeighbor = true;
    } else {
      isBlackNeighbor = true;
    }
    isNeighborChecked = true;
  }
  // Check right
  if (xVal !== newValues[yVal].length-1) {
    if (newValues[yVal][xVal+1] === 0) {
      return false;
    } else if (newValues[yVal][xVal+1] === 1) {
      if (isNeighborChecked && isBlackNeighbor) {
        return false;
      }
      isWhiteNeighbor = true;
    } else {
      if (isNeighborChecked && isWhiteNeighbor) {
        return false;
      }
      isBlackNeighbor = true;
    }
    isNeighborChecked = true;
  }
  // Check bottom
  if (yVal !== newValues.length-1) {
    if (newValues[yVal+1][xVal] === 0) {
      return false;
    } else if (newValues[yVal+1][xVal] === 1) {
      if (isNeighborChecked && isBlackNeighbor) {
        return false;
      }
      isWhiteNeighbor = true;
    } else {
      if (isNeighborChecked && isWhiteNeighbor) {
        return false;
      }
      isBlackNeighbor = true;
    }
    isNeighborChecked = true;
  }
  // Check left
  if (xVal != 0) {
    if (newValues[yVal][xVal-1] === 0) {
      return false;
    } else if (newValues[yVal][xVal-1] === 1) {
      if (isNeighborChecked && isBlackNeighbor) {
        return false;
      }
      // isWhiteNeighbor = true; // ALGORITHM OPTIMIZATION - not used assignment
    } else {
      if (isNeighborChecked && isWhiteNeighbor) {
        return false;
      }
      // isBlackNeighbor = true; // ALGORITHM OPTIMIZATION - not used assignment
    }
    // isNeighborChecked = true; // ALGORITHM OPTIMIZATION - not used assignment
  }
  // If anywhere around there is no empty fields - say it is determined
  return true;
}

/**
 * Evaluate how many stones each user have, including surrounded empty fileds
 * USE IT JUST WHEN GAME IS FINISHED - it is optimized for this case and otherwise it may return wrong results
 */
export const checkFinalPoints = (newValues) => {
  let whitePoints = 0;
  let blackPoints = 0;

  for (let y = 0; y < newValues.length; y++) {
    const row = newValues[y];
    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      const finalColorVal = checkFinalFieldPoint(newValues, val, y, x)
      if (finalColorVal === 1) {
        whitePoints++
      } else {
        blackPoints++
      }
    }
  }

  return [whitePoints, blackPoints]
}
/**
 * Determine for what color the point for this field should be assigned
 * USE IT JUST WHEN GAME IS FINISHED - it is optimized for this case and otherwise it may return wrong results
 */
const checkFinalFieldPoint = (newValues, val, yVal, xVal) => {
  if (val === 1) {
    return 1;
  } else if (val === 2) {
    return 2;
  } else if (val === 0) {
    // Check top
    if (yVal != 0) {
      return newValues[yVal-1][xVal] === 1 ? 1 : 2
    }
    // Check right
    else if (xVal !== newValues[yVal].length-1) {
      return newValues[yVal][xVal+1] === 1 ? 1 : 2
    } 
    // Check bottom
    else if (yVal !== newValues.length-1) {
      return newValues[yVal+1][xVal] === 1 ? 1 : 2
    } 
    // Check left
    else if (xVal != 0) {
      return newValues[yVal][xVal-1] === 1 ? 1 : 2
    }
  }
}
