import Vue from 'vue'
import Vuex from 'vuex'

import { algorithmsTypes, playerMode } from "@/components/BoardController.vue";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    developerOptions: false,
    playerMode: playerMode.PLAYER_COMPUTER,
    boardSizeSelected: 5,
    algorithmsTypeSelected: algorithmsTypes.MIN_MAX_A_B,
    calculationDepthSelected: 2,
    boardValues: Array.from({length: 5}, () => Array(5).fill(0)),
  },
  mutations: {
    SET_DEVELOPER_OPTIONS (state, isOn) {
      state.developerOptions = isOn
    },
    SET_PLAYER_MODE (state, mode) {
      state.playerMode = mode
    },
    SET_BOARD_SIZE (state, size) {
      state.boardSizeSelected = size
      state.boardValues = Array.from({length: size}, () => Array(size).fill(0))
    },
    SET_BOARD_VALUES (state, values) { state.boardValues = values },
    SET_ALGORITHM_TYPE (state, type) { state.algorithmsTypeSelected = type },
    SET_CALCULATION_DEPTH (state, depth){ state.calculationDepthSelected = depth },
  },
  actions: {
    setDeveloperOptions (context, isOn) {
      context.commit('SET_DEVELOPER_OPTIONS', isOn);
    },
    setPlayerMode (context, mode) {
      context.commit('SET_PLAYER_MODE', mode);
    },
    setBoardSizeSelected (context, size) {
      context.commit('SET_BOARD_SIZE', size);
    },
    setBoardValues (context, values) {
      context.commit('SET_BOARD_VALUES', values);
    },
    setAlgorithmsTypeSelected (context, type) {
      context.commit('SET_ALGORITHM_TYPE', type);
    },
    setCalculationDepthSelected (context, depth) {
      context.commit('SET_CALCULATION_DEPTH', depth);
    }
  }
})
