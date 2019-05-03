<template>
  <div class="board">
    <div class="row-num">
      <div class="cell-num"></div>
      <div v-for="j in 9" :key="`n${j}`" class="cell-num">
        {{j}}
      </div>
    </div>
    <div v-for="i in 9" :key="`1${i}`" class="row">
      <div class="cell-num">
        {{i}}
      </div>
      <div v-for="j in 9" :key="`2${j}`" class="cell" 
        @mouseover="mouseOver(i, j)" 
        @mouseleave="mouseLeave(i, j)"
        @click="click(i, j)">
        <div 
          class="stone" 
          :class="{ 
            'stone-white': values[i-1][j-1] === 1 || (currentColor === 1 && values[i-1][j-1] !== 2),
            'stone-black': values[i-1][j-1] === 2 || (currentColor === 2 && values[i-1][j-1] !== 1)
          }" 
          v-show="values[i-1][j-1] === 1 || values[i-1][j-1] === 2 || hoverValues[i-1][j-1]">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentColor: {
      type: Number,
      required: true,
    },
    values: {
      type: Array,
      required: true,
      validator: values => {
        return values && values.length === 9 && values[0].length === 9
      },
    }
  },
  data: () => ({
    hoverValues: [
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false]
    ]
  }),
  methods: {
    mouseOver (i, j) {
      //make a copy of the row
      const newRow = this.hoverValues[i-1].slice(0)
      // update the value
      newRow[j-1] = true
      // update it in the grid
      this.$set(this.hoverValues, i-1, newRow)
    },
    mouseLeave (i, j) {
      //make a copy of the row
      const newRow = this.hoverValues[i-1].slice(0)
      // update the value
      newRow[j-1] = false
      // update it in the grid
      this.$set(this.hoverValues, i-1, newRow)
    },
    click (i, j) {
      if (this.values[i-1][j-1] === 0) {
        this.$emit('click', i, j)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  height: 100%;
}
.row {
  width: 100%;
  display: flex;
  height: 5vh;
  min-height: 30px;
  background-image: linear-gradient(to bottom, rgb(150, 150, 150) 1px, transparent 1px);
  background-color: transparent;
  background-size: 100% 1px;
  background-position: calc(100%/9/2);
  .cell{
    background-image: linear-gradient(to right, rgb(150, 150, 150) 1px, transparent 1px);
    background-color: transparent;
    background-size: 1px 1px;
    background-repeat: repeat-y;
    background-position: center;
    width: 100%;
    cursor: pointer;
  }
}
.row-num {
  width: 100%;
  display: flex;
  height: 5vh;
  min-height: 30px;
}
.cell-num{
  width: 100%;
}
.stone{
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
  box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
}
.stone-white{
  background: #ffffff;
}
.stone-black{
  background: #424242;
}
</style>
