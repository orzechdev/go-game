
const BOARD_WIDTH = 8;

/**
 * Evaluate how many stones each user have, including surrounded empty fileds
 */
export const checkCurrentPoints = (newValues) => {
  let whitePoints = 0;
  let blackPoints = 0;

  for (let y = 0; y < BOARD_WIDTH; y++) {
    const row = newValues[y];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const val = row[x];
      const currentColorVal = checkCurrentFieldPoint(newValues, val, y, x)
      if (currentColorVal === 1) {
        whitePoints++
      } else if (currentColorVal === 2) {
        blackPoints++
      }
    }
  }

  return [whitePoints, blackPoints]
}
/**
 * Determine for what color the point for this field should be assigned
 */
const checkCurrentFieldPoint = (newValues, val, yVal, xVal) => {
  if (val === 1) {
    return 1;
  } else if (val === 2) {
    return 2;
  } else if (val === 0) {
    let surroundedColorCheck;
    // Check top
    if (yVal != 0) {
      if (newValues[yVal-1][xVal] === 0) {
        return 0;
      }
      surroundedColorCheck = newValues[yVal-1][xVal]
    }
    // Check right
    else if (xVal !== BOARD_WIDTH-1) {
      if (newValues[yVal][xVal+1] !== surroundedColorCheck) {
        return 0;
      }
    } 
    // Check bottom
    else if (yVal !== BOARD_WIDTH-1) {
      if (newValues[yVal+1][xVal] !== surroundedColorCheck) {
        return 0;
      }
    } 
    // Check left
    else if (xVal != 0) {
      if (newValues[yVal][xVal-1] !== surroundedColorCheck) {
        return 0;
      }
    }

    // Pass checking and return color by which is surrounded
    return surroundedColorCheck;
  }
}

export const isFieldSurroundedByNothing = (newValues, yVal, xVal) => {
  // Check top
  if (yVal != 0) {
    if (newValues[yVal-1][xVal] !== 0) {
      return false;
    }
  }
  // Check right
  if (xVal !== BOARD_WIDTH-1) {
    if (newValues[yVal][xVal+1] !== 0) {
      return false;
    }
  }
  // Check bottom
  if (yVal !== BOARD_WIDTH-1) {
    if (newValues[yVal+1][xVal] !== 0) {
      return false;
    }
  }
  // Check left
  if (xVal != 0) {
    if (newValues[yVal][xVal-1] !== 0) {
      return false;
    }
  }

  return true;
}