<template>
  <v-container>
    <v-layout text-xs-center wrap justify-space-around>
      <v-flex mb-5 xs12 sm10 md8 lg6>
        <board :currentColor="currentColor" :values="values" @click="click">
        </board>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Board from './Board.vue'

export default {
  components: {
    Board
  },
  data: () => ({
    currentColor: 1,
    values: [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,2,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ],
  }),
  methods: {
    click (i, j) {
      //make a copy of the row
      const newRow = this.values[i-1].slice(0)
      // update the value
      newRow[j-1] = this.currentColor
      // update it in the grid
      this.$set(this.values, i-1, newRow)
      // Change current color
      this.currentColor = this.currentColor === 1 ? 2 : 1
    }
  }
};
</script>

<style>
</style>
