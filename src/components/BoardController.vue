<template>
  <v-container>
    <v-layout text-xs-center wrap justify-space-around>
      <v-flex mb-5 xs12 sm10 md8 lg6>
        <board 
          :currentColor="currentColor" 
          :values="values" 
          :size="boardSizeSelected"
          @click="click">
        </board>
        <v-flex class="button-container">
          <v-btn color="white" @click="changeToWhite">White</v-btn>
          <v-btn color="black" class="white-text" @click="changeToBlack">Black</v-btn>
        </v-flex>
        <v-flex xs12 sm6 class="button-container">
          <v-select
            v-model="boardSizeSelected"
            @change="changeBoardSize"
            :items="boardSizes"
            label="Board size"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 class="button-container">
          <v-select
            v-model="calculationDepthSelected"
            :items="calculationDepths"
            label="Calculation depth"
            :error-messages="calculationDepthSelected < 3 ? [] : 'Selected depth can significantly increase the calculation time and cause the browser to hang!'"
          ></v-select>
        </v-flex>
        <v-flex class="button-container margin-bottom">
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
    values: Array.from({length: 5}, () => Array(5).fill(0)),
    //[[0,0,0,0,0,0,0,0,0],[0,2,2,2,1,0,0,0,0],[0,2,2,0,2,1,0,0,0],[0,0,2,1,0,1,0,0,0],[0,0,1,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    // [[2,0,2,2,2,1,1,0,1],[2,2,2,0,1,2,2,1,0],[2,0,2,1,0,1,2,2,2],[2,2,0,1,1,0,1,1,0],[1,2,1,0,1,1,2,2,1],[1,1,0,0,1,2,2,0,2],[2,2,2,1,0,1,1,2,0],[1,1,1,0,1,0,2,2,2],[1,0,1,1,1,2,2,0,2]]
    // [
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    // ],
    calculationDepths: [1, 2, 3],
    calculationDepthSelected: 2,
    calculationTimes: [],
    boardSizes: [19, 17, 13, 11, 9, 5],
    boardSizeSelected: 5
  }),
  methods: {
    changeBoardSize (size) {
      this.values = Array.from({length: size}, () => Array(size).fill(0))
    },
    changeToWhite () {
      this.currentColor = 1
    },
    changeToBlack () {
      this.currentColor = 2
    },
    click (i, j) {
      this.placeStoneAndEvaluate(this.currentColor, i, j)

      if (isGameFinished(this.values, this.boardSizeSelected)) {
        console.log('GAME FINISHED')
        const [whitePoints, blackPoints] = checkFinalPoints(this.values, this.boardSizeSelected)
        console.log(`white points: ${whitePoints}, black points: ${blackPoints}`)
        this.onFinishGame(whitePoints, blackPoints)
      } else {
        let valuesToCalculate = this.values.map(arr => arr.slice())

        const opponentColor = this.currentColor === 1 ? 2 : 1

        const start = +new Date();
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        // calculateMinMaxMove(valuesToCalculate, opponentColor, 2)
        const {outcome, y, x} = calculateMinMaxMove(valuesToCalculate, opponentColor, this.boardSizeSelected, this.calculationDepthSelected)
        const end = +new Date();
        const diffTime = end - start;
        this.calculationTimes.push(diffTime)

        console.log(`calculateMinMaxMove - outcome:${outcome} y:${y} x:${x}`)
        console.log(`calculateMinMaxMove - time spend:${diffTime}`)

        this.placeStoneAndEvaluate(opponentColor, y+1, x+1)

        if (isGameFinished(this.values, this.boardSizeSelected)) {
          console.log('GAME FINISHED')
          const [whitePoints, blackPoints] = checkFinalPoints(this.values, this.boardSizeSelected)
          console.log(`white points: ${whitePoints}, black points: ${blackPoints}`)
          this.onFinishGame(whitePoints, blackPoints)
        }
      }
    },
    placeStoneAndEvaluate(color, i, j) {
      //make a copy of the row
      const newRow = this.values[i-1].slice(0)
      // update the value
      newRow[j-1] = color
      // update it in the grid
      this.$set(this.values, i-1, newRow)

      let valuesToEvaluate = this.values.map(arr => arr.slice())

      // console.log("VALUES TO EVALUATE")
      // console.log(valuesToEvaluate)

      let [currentValuesChanged, evaluatedValues] = evaluateBoard(valuesToEvaluate, this.boardSizeSelected)

      console.log("EVALUATED VALUES")
      console.log(evaluatedValues)

      if (currentValuesChanged) {
        this.values = evaluatedValues
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
      this.calculationTimes = [];
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
    margin-left: auto;
    margin-right: auto;
  }
  .margin-bottom {
    margin-bottom: 80px;
  }
</style>
