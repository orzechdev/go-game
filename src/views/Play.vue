<template>
  <v-content>
    <board-controller
      :boardSizeSelected="boardSizeSelected"
      :algorithmsTypeSelected="algorithmsTypeSelected"
      :calculationDepthSelected="calculationDepthSelected"
      :values="boardValues"
      @setBoardValues="setBoardValues"
      :showTestOptions="developerOptions"
      @onFinishGame="onFinishGame"
      ref="boardControllerRef">
    </board-controller>

    <v-dialog v-model="finishDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{finishDialogTitle}}</v-card-title>
        <v-card-text>{{finishDialogDescription}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="finishDialog = false">Close</v-btn>
          <v-btn flat color="primary" @click="onClickEmptyBoard">Empty board</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="finishDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{finishDialogTitle}}</v-card-title>
        <v-card-text>{{finishDialogDescription}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="finishDialog = false">Close</v-btn>
          <v-btn flat color="primary" @click="onClickEmptyBoard">Empty board</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BoardController, { algorithmsTypes } from "@/components/BoardController.vue";

export default {
  name: "App",
  components: {
    BoardController
  },
  data() {
    return {
      finishDialog: false,
      finishDialogTitle: '',
      finishDialogDescription: '',
    };
  },
  computed: {
    ...mapState([
      'developerOptions',
      'boardSizeSelected',
      'algorithmsTypeSelected',
      'calculationDepthSelected',
      'boardValues',
    ])
  },
  methods: {
    ...mapActions([
      'setBoardValues',
    ]),
    onFinishGame (whitePoints, blackPoints) {
      this.finishDialog = true
      if (whitePoints > blackPoints) {
        this.finishDialogTitle = 'White stones won!'
      } else if (whitePoints < blackPoints) {
        this.finishDialogTitle = 'Black stones won!'
      } else {
        this.finishDialogTitle = 'Tie!'
      }
      this.finishDialogDescription = `Black points: ${blackPoints}, white points: ${whitePoints}`
    },
    onClickEmptyBoard () {
      this.$refs.boardControllerRef.emptyBoard()
      this.finishDialog = false
    },
  }
};
</script>
