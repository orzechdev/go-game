<template>
  <v-content class="content">
    <v-flex xs12 sm6 class="button-container">
      <v-select
        :value="boardSizeSelected"
        @change="setBoardSizeSelected"
        :items="boardSizes"
        label="Board size"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
      <v-select
        :value="algorithmsTypeSelected"
        @change="setAlgorithmsTypeSelected"
        :items="algorithmsTypes"
        label="Algorithms type"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
      <v-select
        :value="calculationDepthSelected"
        @change="setCalculationDepthSelected"
        :items="calculationDepths"
        label="Calculation depth"
        :error-messages="calculationDepthSelected < 3 ? [] : 'Selected depth can significantly increase the calculation time and cause the application to hang!'"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
      <v-switch
        color="primary"
        :input-value="developerOptions"
        @change="setDeveloperOptions"
        :label="`Developer options: ${developerOptions ? 'on' : 'off'}`"
      ></v-switch>
    </v-flex>
  </v-content>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { algorithmsTypes } from "@/components/BoardController.vue"

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  computed: {
    ...mapState([
      'developerOptions',
      'boardSizeSelected',
      'algorithmsTypeSelected',
      'calculationDepthSelected',
    ]),
  },
  data() {
    return {
      calculationDepths: [1, 2, 3],
      boardSizes: [19, 17, 13, 11, 9, 5],
      algorithmsTypes: [algorithmsTypes.MIN_MAX, algorithmsTypes.MIN_MAX_A_B],
    }
  },
  methods: {
    ...mapActions([
      'setDeveloperOptions',
      'setBoardSizeSelected',
      'setAlgorithmsTypeSelected',
      'setCalculationDepthSelected',
    ]),
  },
};
</script>

<style lang="scss">
  .content {
    margin: 0 20px;
  }
  .button-container {
    margin: 30px auto;
  }
</style>
