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
            v-model="algorithmsTypeSelected"
            :items="algorithmsTypes"
            label="Algorithms type"
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
        <v-flex class="button-container">
          <v-btn @click="emptyBoard">Empty board</v-btn>
        </v-flex>
        <v-flex class="button-container">
          <v-btn @click="testAllAlgorithms">Test all algorithms</v-btn>
        </v-flex>
        <v-flex class="button-container margin-bottom">
          <v-btn @click="testAllAlgorithmsFiveTimes">Test all algorithms five times</v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Board from './Board.vue'
import { direction, colors } from "./boardConsts";
import { evaluateBoard } from "./boardStateEvaluation";
import { isGameFinished, checkFinalPoints } from "./boardFinishEvaluation";
import { calculateMinMaxMove } from "./calculateBestMove"
import { calculateMinMaxAlphaBetaPrunedMove } from "./calculateBestMoveAlphaBeta"
import { getRandomInt } from "./boardTest"

const algorithmsTypes = {
  MIN_MAX: 'min-max',
  MIN_MAX_A_B: 'min-max (alpha-beta pruning)',
}

export default {
  components: {
    Board
  },
  data() {
    return {
      /**
       * 1 - white
       * 2 - black
       */
      currentColor: 2,
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
      firstPlayerCalculationTimes: [],
      secondPlayerCalculationTimes: [],
      firstPlayerTestGameCalculationTimes: [],
      secondPlayerTestGameCalculationTimes: [],
      testGameWonsPlayerColors: [],
      testGameWonsPlayers_FOR_HELP_TO_DETERMINE_PLAYERS: Array.from({length: 3}, () => Array(3).fill(0)),
      testGamesValuesForWhiteForDepths: Array.from({length: 3}, () => Array(3).fill(0)),
      testGamesTimesForDepths: Array(3).fill(0),
      ALLtestGamesValuesForWhiteForDepths: Array.from({length: 3}, () => Array.from({length: 3}, () => Array(5).fill(0))),
      ALLtestGamesTimesForDepths: Array.from({length: 3}, () => Array(5).fill(0)),
      MEANtestGamesValuesForWhiteForDepths: Array.from({length: 3}, () => Array(3).fill(0)),
      MEANtestGamesTimesForDepths: Array(3).fill(0),
      boardSizes: [19, 17, 13, 11, 9, 5],
      boardSizeSelected: 5,
      algorithmsTypes: [algorithmsTypes.MIN_MAX, algorithmsTypes.MIN_MAX_A_B],
      algorithmsTypeSelected: algorithmsTypes.MIN_MAX_A_B
    }
  },
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

        const {outcome, y, x} = this.calculateMoveWithAlgorithm(valuesToCalculate, opponentColor, this.boardSizeSelected, this.calculationDepthSelected)
        const end = +new Date();
        const diffTime = end - start;
        this.secondPlayerCalculationTimes.push(diffTime)

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

      // console.log("EVALUATED VALUES")
      // console.log(evaluatedValues)

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
      // for (let y = 0; y < this.values.length; y++) {
      //   for (let x = 0; x < this.values[y].length; x++) {
      //     this.values[y][x] = 0;
      //   }
      // }
      this.values = Array.from({length: this.boardSizeSelected}, () => Array(this.boardSizeSelected).fill(0))
      this.currentColor = 2;
      this.firstPlayerCalculationTimes = [];
      this.secondPlayerCalculationTimes = [];
    },
    calculateMoveWithAlgorithm (valuesToCalculate, opponentColor, boardSizeSelected, calculationDepthSelected) {
      if (this.algorithmsTypeSelected === algorithmsTypes.MIN_MAX) {
        return calculateMinMaxMove(valuesToCalculate, opponentColor, boardSizeSelected, calculationDepthSelected)
      } else {
        return calculateMinMaxAlphaBetaPrunedMove(valuesToCalculate, opponentColor, boardSizeSelected, calculationDepthSelected)
      }
    },
    testAllAlgorithmsFiveTimes () {
      /**
       * Play 5 times each algorithm depth -> each algorithm depth will have 5 games played i.e. 5 values of games
       */
      for (let i = 0; i < 5; i++) {
        const { testGamesValuesForWhiteForDepths, testGamesTimesForDepths } = this.testAllAlgorithms();
        
        for (let secondPlayerDepth = 1; secondPlayerDepth <= 3; secondPlayerDepth++) {
          for (let firstPlayerDepth = 1; firstPlayerDepth <= 3; firstPlayerDepth++) {
            this.ALLtestGamesValuesForWhiteForDepths[secondPlayerDepth-1][firstPlayerDepth-1][i] = testGamesValuesForWhiteForDepths[secondPlayerDepth-1][firstPlayerDepth-1]
            if (firstPlayerDepth === secondPlayerDepth)
              this.ALLtestGamesTimesForDepths[secondPlayerDepth-1][i] = testGamesTimesForDepths[secondPlayerDepth-1]
          }
        }

        console.log(`###   ALL ALGORITHMS TESTES game:${i+1}   ###`)
      }

      /**
       * Calculate mean values of each algorithm depth from 5 games
       */
      for (let secondPlayerDepth = 1; secondPlayerDepth <= 3; secondPlayerDepth++) {
        for (let firstPlayerDepth = 1; firstPlayerDepth <= 3; firstPlayerDepth++) {
          const ALLvalues = this.ALLtestGamesValuesForWhiteForDepths[secondPlayerDepth-1][firstPlayerDepth-1]
          const sumValues = ALLvalues.reduce((a, b) => a + b);
          const avgValues = sumValues / ALLvalues.length;
          this.MEANtestGamesValuesForWhiteForDepths[secondPlayerDepth-1][firstPlayerDepth-1] = avgValues
          if (firstPlayerDepth === secondPlayerDepth) {
            const ALLtimes = this.ALLtestGamesTimesForDepths[secondPlayerDepth-1]
            const sumTimes = ALLtimes.reduce((a, b) => a + b);
            const avgTimes = sumTimes / ALLtimes.length;
            this.MEANtestGamesTimesForDepths[secondPlayerDepth-1] = avgTimes
          }
        }
      }

      console.log(this.MEANtestGamesValuesForWhiteForDepths)
      console.log(this.MEANtestGamesTimesForDepths)
    },
    testAllAlgorithms () {
      for (let secondPlayerDepth = 1; secondPlayerDepth <= 3; secondPlayerDepth++) {
        for (let firstPlayerDepth = 1; firstPlayerDepth <= 3; firstPlayerDepth++) {
          this.emptyBoard()

          const firstPlayer = {
            firstColor: colors.BLACK,
            firstDepth: firstPlayerDepth
          }
          const secondPlayer = {
            secondColor: colors.WHITE,
            secondDepth: secondPlayerDepth
          }

          console.log(`Start first(color:${firstPlayer.firstColor} depth:${firstPlayer.firstDepth}), second(color:${secondPlayer.secondColor} depth: ${secondPlayer.secondDepth})`)

          const {gameValuePointsForWhite, gameTwoPlayersTime} = this.testTwoAlgorithms(firstPlayer, secondPlayer)

          this.testGameWonsPlayers_FOR_HELP_TO_DETERMINE_PLAYERS[secondPlayerDepth-1][firstPlayerDepth-1] = firstPlayerDepth
          this.testGamesValuesForWhiteForDepths[secondPlayerDepth-1][firstPlayerDepth-1] = gameValuePointsForWhite
          if (firstPlayerDepth === secondPlayerDepth)
            this.testGamesTimesForDepths[secondPlayerDepth-1] = gameTwoPlayersTime / 2 // Mean value
        }
      }

      return {
        testGamesValuesForWhiteForDepths: this.testGamesValuesForWhiteForDepths,
        testGamesTimesForDepths: this.testGamesTimesForDepths,
      }
      
      // this.onFinishGame(whitePoints, blackPoints)
    },
    testTwoAlgorithms (firstPlayer, secondPlayer) {
      const { firstColor, firstDepth } = firstPlayer
      const { secondColor, secondDepth } = secondPlayer

      const firstX = getRandomInt(0, this.boardSizeSelected-1)
      const firstY = getRandomInt(0, this.boardSizeSelected-1)

      this.placeStoneAndEvaluate(firstColor, firstY+1, firstX+1)

      let currentColor = secondColor
      let currentDepth = secondDepth

      let firstPlayerGameTime = 0
      let secondPlayerGameTime = 0

      do {
        let valuesToCalculate = this.values.map(arr => arr.slice())

        const start = +new Date();
        // const {outcome, y, x} = calculateMinMaxMove(valuesToCalculate, currentColor, this.boardSizeSelected, currentDepth)
        const {outcome, y, x} = this.calculateMoveWithAlgorithm(valuesToCalculate, currentColor, this.boardSizeSelected, currentDepth)
        const end = +new Date();
        const diffTime = end - start;

        // console.log(`calculateMinMaxMove - outcome:${outcome} y:${y} x:${x}`)
        // console.log(`calculateMinMaxMove - time spend:${diffTime}`)

        this.placeStoneAndEvaluate(currentColor, y+1, x+1)

        if (currentColor === firstColor) {
          firstPlayerGameTime += diffTime
          // this.firstPlayerCalculationTimes.push(diffTime)
          currentDepth = secondDepth
          currentColor = secondColor
        } else {
          secondPlayerGameTime += diffTime
          // this.secondPlayerCalculationTimes.push(diffTime)
          currentDepth = firstDepth
          currentColor = firstColor
        }
      } while (!isGameFinished(this.values, this.boardSizeSelected));

      console.log('GAME FINISHED')
      const [whitePoints, blackPoints] = checkFinalPoints(this.values, this.boardSizeSelected)
      const winnerColor = whitePoints >= blackPoints ? colors.WHITE : colors.BLACK // Komi rule - if points are equal then white win
      // this.testGameWonsPlayerColors.push(winnerColor)
      console.log(`white points: ${whitePoints}, black points: ${blackPoints}`)
      // this.firstPlayerTestGameCalculationTimes.push(firstPlayerGameTime)
      // this.secondPlayerTestGameCalculationTimes.push(secondPlayerGameTime)
      console.log(`white game calculation time: ${secondPlayerGameTime}, black game calculation time: ${firstPlayerGameTime}`)

      return {gameValuePointsForWhite: whitePoints - blackPoints, gameTwoPlayersTime: firstPlayerGameTime + secondPlayerGameTime}
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
