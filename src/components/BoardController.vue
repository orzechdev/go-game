<template>
  <v-container>
    <v-layout text-xs-center wrap justify-space-around>
      <v-flex mb-5 xs12 sm10 md8 lg6>
        <board 
          :currentColor="currentColor" 
          :values="values" 
          @click="click">
        </board>
        <v-btn color="white" @click="changeToWhite">White</v-btn>
        <v-btn color="black" class="white-text" @click="changeToBlack">Black</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Board from './Board.vue'

const direction = {
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
  LEFT: 4
}

export default {
  components: {
    Board
  },
  data: () => ({
    currentColor: 1,
    values: [[0,0,0,0,0,0,0,0,0],[0,2,2,2,1,0,0,0,0],[0,2,2,0,2,1,0,0,0],[0,0,2,1,0,1,0,0,0],[0,0,1,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    // [
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,2,0,0,0,0,0,0],
    //   [0,0,0,1,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    // ],
  }),
  methods: {
    changeToWhite () {
      this.currentColor = 1
    },
    changeToBlack () {
      this.currentColor = 2
    },
    click (i, j) {
      //make a copy of the row
      const newRow = this.values[i-1].slice(0)
      // update the value
      newRow[j-1] = this.currentColor
      // update it in the grid
      this.$set(this.values, i-1, newRow)

      let valuesToEvaluate = this.values.map(arr => arr.slice())

      let [currentValuesChanged, evaluatedValues] = this.evaluateBoard(valuesToEvaluate)

      if (currentValuesChanged) {
        this.values = evaluatedValues
      }
      // Change current color
      // this.currentColor = this.currentColor === 1 ? 2 : 1
    },
    /**
     * Iterate over the whole board and removes sourrounded values if placed value in newValues shold cause it
     */
    evaluateBoard (newValues) {
      let valuesWereChanged = false;
      let valuesAreChanged = false;
      // Opponent values might be surrounded in more then one place, thus need to be calculated as much time as possible
      do {
        valuesAreChanged = false;
        // Iterate over the whole board
        for (let y = 0; y < newValues.length; y++) {
          const row = newValues[y];
          let isChanged = false;
          for (let x = 0; x < row.length; x++) {
            const val = row[x];
            if (val != 0) {
              let [currentValuesChanged, evaluatedValues] = this.evaluateCurrentValue(newValues, val, y, x)
              isChanged = currentValuesChanged;
              console.log(currentValuesChanged)
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
    },
    /**
     * Check if the current stone in given place is surrounded by opponent's stones
     */
    evaluateCurrentValue (newValues, val, yVal, xVal) {
      const opponentColor = val === 1 ? 2 : 1;
      let valuesAreChanged = false;
      let checkedValues = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]
      // Chack top
      if (yVal != 0) {
        if (newValues[yVal-1][xVal] === opponentColor) {
          console.log(`p 1 val:${val} yVal:${yVal} xVal:${xVal}`)
          let [isSorrounded, obtainedValues] = this.evaluateOpponentValue(newValues, val, yVal-1, xVal, direction.BOTTOM, checkedValues)
          if (isSorrounded) {
            valuesAreChanged = true;
            console.log('pass 1')
            newValues = obtainedValues;
          }
        }
      }
      // Check right
      if (xVal !== newValues[yVal].length-1) {
        if (newValues[yVal][xVal+1] === opponentColor) {
          console.log(`p 2 val:${val} yVal:${yVal} xVal:${xVal}`)
          let [isSorrounded, obtainedValues] = this.evaluateOpponentValue(newValues, val, yVal, xVal+1, direction.LEFT, checkedValues)
          if (isSorrounded) {
            valuesAreChanged = true;
            console.log('pass 2')
            newValues = obtainedValues;
          }
        }
      }
      // Check bottom
      if (yVal !== newValues.length-1) {
        if (newValues[yVal+1][xVal] === opponentColor) {
          console.log(`p 3 val:${val} yVal:${yVal} xVal:${xVal}`)
          let [isSorrounded, obtainedValues] = this.evaluateOpponentValue(newValues, val, yVal+1, xVal, direction.TOP, checkedValues)
          if (isSorrounded) {
            valuesAreChanged = true;
            console.log('pass 3')
            newValues = obtainedValues;
          }
        }
      }
      // Check left
      if (xVal != 0) {
        if (newValues[yVal][xVal-1] === opponentColor) {
          console.log(`p 4 val:${val} yVal:${yVal} xVal:${xVal}`)
          let [isSorrounded, obtainedValues] = this.evaluateOpponentValue(newValues, val, yVal, xVal-1, direction.RIGHT, checkedValues)
          if (isSorrounded) {
            valuesAreChanged = true;
            console.log('pass 4')
            newValues = obtainedValues;
          }
        }
      }
      // Resluting Values after current value is placed
      return [valuesAreChanged, newValues]; 
    },
    evaluateOpponentValue (newValues, val, yVal, xVal, prevDirection, checkedValues) {
      let checkedValuesMap = checkedValues.map(arr => arr.slice());
      checkedValuesMap[yVal][xVal] = 1;

      const opponentColor = val === 1 ? 2 : 1;
      console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection}`)
      let evaluatedValues = newValues.map(arr => arr.slice());

      // Chack top
      if (yVal != 0 && prevDirection !== direction.TOP && checkedValuesMap[yVal-1][xVal] != 1) {
        console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 1`)
        if (evaluatedValues[yVal-1][xVal] === opponentColor) {
          let [isSorrounded, obtainedValues, checkedValuesObtained] = this.evaluateOpponentValue(evaluatedValues, val, yVal-1, xVal, direction.BOTTOM, checkedValuesMap)
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
      if (xVal !== evaluatedValues[yVal].length-1 && prevDirection !== direction.RIGHT && checkedValuesMap[yVal][xVal+1] != 1) {
        console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 2`)
        if (evaluatedValues[yVal][xVal+1] === opponentColor) {
          let [isSorrounded, obtainedValues, checkedValuesObtained] = this.evaluateOpponentValue(evaluatedValues, val, yVal, xVal+1, direction.LEFT, checkedValuesMap)
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
      if (yVal !== evaluatedValues.length-1 && prevDirection !== direction.BOTTOM && checkedValuesMap[yVal+1][xVal] != 1) {
        console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 3`)
        if (evaluatedValues[yVal+1][xVal] === opponentColor) {
          let [isSorrounded, obtainedValues, checkedValuesObtained] = this.evaluateOpponentValue(evaluatedValues, val, yVal+1, xVal, direction.TOP, checkedValuesMap)
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
        console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 4`)
        if (evaluatedValues[yVal][xVal-1] === opponentColor) {
          let [isSorrounded, obtainedValues, checkedValuesObtained] = this.evaluateOpponentValue(evaluatedValues, val, yVal, xVal-1, direction.RIGHT, checkedValuesMap)
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
      console.log(evaluatedValues)
      return [true, evaluatedValues, checkedValuesMap];
    }
  }
};
</script>

<style>
  .white-text {
    color: white !important;
  }
</style>
