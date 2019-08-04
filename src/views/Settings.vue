<template>
  <v-content>
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
        :error-messages="calculationDepthSelected < 3 ? [] : 'Selected depth can significantly increase the calculation time and cause the application to hang!'"
      ></v-select>
    </v-flex>
  </v-content>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { algorithmsTypes } from "@/components/BoardController.vue";

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      calculationDepths: [1, 2, 3],
      calculationDepthSelected: 2,
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
  },
};
</script>
