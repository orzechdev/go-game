<template>
  <div class="board">
    <div class="row-num">
      <div class="cell-num"></div>
      <div v-for="j in size" :key="`n${j}`" class="cell-num">
        {{ALPHABET[j]}}
      </div>
    </div>
    <div v-for="i in size" :key="`1${i}`" :class="['row', 'row-' + size]">
      <div class="cell-num">
        {{i}}
      </div>
      <div v-for="j in size" :key="`2${j}`" class="cell" 
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
        return values && 
        (values.length === 5 && values[0].length === 5) ||
        (values.length === 9 && values[0].length === 9) ||
        (values.length === 11 && values[0].length === 11) ||
        (values.length === 13 && values[0].length === 13) ||
        (values.length === 17 && values[0].length === 17) ||
        (values.length === 19 && values[0].length === 19)
      },
    },
    size: {
      type: Number,
      required: true,
      validator: value => {
        return value && 
        value === 5 || value === 9 || value === 11 || value === 13 || value === 17 || value === 19
      },
    }
  },
  data() {
    return {
      ALPHABET: 'abcdefghijklmnopqrstuvwxyz',
      hoverValues: Array.from({length: this.size}, () => Array(this.size).fill(false))
    }
  },
  watch: {
    size (newSize) { 
      this.hoverValues = Array.from({length: newSize}, () => Array(newSize).fill(false))
    }
  },
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
  // height: 100%;
  margin-bottom: 60px;
}
.row {
  width: 100%;
  display: flex;
  height: 5vh;
  min-height: 30px;
  background-image: linear-gradient(to bottom, rgb(150, 150, 150) 1px, transparent 1px);
  background-color: transparent;
  background-size: 100% 1px;
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
.row-5 {
  background-position: calc(100%/5/2);
}
.row-9 {
  background-position: calc(100%/9/2);
}
.row-11 {
  background-position: calc(100%/11/2);
}
.row-13 {
  background-position: calc(100%/13/2);
}
.row-17 {
  background-position: calc(100%/17/2);
}
.row-19 {
  background-position: calc(100%/19/2);
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
