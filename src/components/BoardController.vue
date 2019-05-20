<template>
  <v-container>
    <v-layout text-xs-center wrap justify-space-around>
      <v-flex mb-5 xs12 sm10 md8 lg6>
        <board 
          :currentColor="currentColor" 
          :values="values" 
          @click="click">
        </board>
        <v-flex class="button-container">
          <v-btn color="white" @click="changeToWhite">White</v-btn>
          <v-btn color="black" class="white-text" @click="changeToBlack">Black</v-btn>
        </v-flex>
        <v-flex class="button-container">
          <v-btn @click="emptyBoard">Empty board</v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Board from './Board.vue'
import { direction } from "./boardConsts";
import { evaluateBoard } from "./boardStateEvaluation";
import { isGameFinished, checkFinalPoints } from "./boardFinishEvaluation";
import { calculateMinMaxMove } from "./calculateBestMove"

export default {
  components: {
    Board
  },
  data: () => ({
    /**
     * 1 - white
     * 2 - black
     */
    currentColor: 1,
    values: //[[0,0,0,0,0,0,0,0,0],[0,2,2,2,1,0,0,0,0],[0,2,2,0,2,1,0,0,0],[0,0,2,1,0,1,0,0,0],[0,0,1,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    [[2,0,2,2,2,1,1,0,1],[2,2,2,0,1,2,2,1,0],[2,0,2,1,0,1,2,2,2],[2,2,0,1,1,0,1,1,0],[1,2,1,0,1,1,2,2,1],[1,1,0,0,1,2,2,0,2],[2,2,2,1,0,1,1,2,0],[1,1,1,0,1,0,2,2,2],[1,0,1,1,1,2,2,0,2]]
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

      let [currentValuesChanged, evaluatedValues] = evaluateBoard(valuesToEvaluate)

      if (currentValuesChanged) {
        this.values = evaluatedValues
      }
      // Change current color
      // this.currentColor = this.currentColor === 1 ? 2 : 1

      if (isGameFinished(this.values)) {
        console.log('GAME FINISHED')
        const [whitePoints, blackPoints] = checkFinalPoints(this.values)
        console.log(`white points: ${whitePoints}, black points: ${blackPoints}`)
        this.onFinishGame(whitePoints, blackPoints)
      } else {
        let valuesToCalculate = this.values.map(arr => arr.slice())

        const opponentColor = this.currentColor === 1 ? 2 : 1

        /**
         * TODO: calculateMinMaxMove returns nothing - its wrong...
         */
        const {outcome, y, x} = calculateMinMaxMove(valuesToCalculate, opponentColor)

        console.log(`calculateMinMaxMove - outcome:${outcome} y:${y} x:${x}`)

        // TODO: uncomment, maybe change smth if needed...
        // //make a copy of the row
        // const anotherNewRow = this.values[y-1].slice(0)
        // // update the value
        // anotherNewRow[x-1] = opponentColor
        // // update it in the grid
        // this.$set(this.values, y-1, anotherNewRow)

        // valuesToEvaluate = this.values.map(arr => arr.slice())

        // let [currentValuesChanged, evaluatedValues] = evaluateBoard(valuesToCalculate)

        // if (currentValuesChanged) {
        //   this.values = evaluatedValues
        // }

        // if (isGameFinished(this.values)) {
        //   console.log('GAME FINISHED')
        //   const [whitePoints, blackPoints] = checkFinalPoints(this.values)
        //   console.log(`white points: ${whitePoints}, black points: ${blackPoints}`)
        //   this.onFinishGame(whitePoints, blackPoints)
        // }
      }
    },
    onFinishGame (whitePoints, blackPoints) {
      this.$emit('onFinishGame', whitePoints, blackPoints)
    },
    /**
     * Empty board
     * Method might be called from parent component 
     */
    emptyBoard () {
      for (let y = 0; y < this.values.length; y++) {
        for (let x = 0; x < this.values[y].length; x++) {
          this.values[y][x] = 0;
        }
      }
      this.currentColor = 2;
    }
  }
};
</script>

<style>
  .white-text {
    color: white !important;
  }
  .button-container {
    margin-bottom: 30px;
  }
</style>
