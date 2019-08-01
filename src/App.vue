<template>
  <v-app>
    <v-toolbar app dark color="primary">
      <v-toolbar-title class="headline text-uppercase">Go Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/orzechdev/go-game/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <board-controller
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

    <v-bottom-nav :active.sync="bottomNav" :value="true" fixed color="white">
      <v-btn color="primary" flat value="play">
        <span class="font-weight-bold">Play</span>
        <v-icon>play_circle_filled</v-icon>
      </v-btn>

      <v-btn color="primary" flat value="settings">
        <span class="font-weight-bold">Settings</span>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
import BoardController from "./components/BoardController.vue";

export default {
  name: "App",
  components: {
    BoardController
  },
  data() {
    return {
      bottomNav: 'play',
      finishDialog: false,
      finishDialogTitle: '',
      finishDialogDescription: ''
    };
  },
  methods: {
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
    }
  }
};
</script>
