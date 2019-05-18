<template>
  <v-app>
    <v-toolbar app dark color="primary">
      <v-toolbar-title class="headline text-uppercase">Vue Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/orzechdev/vue-game/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <board-controller></board-controller>
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
      bottomNav: 'play'
    };
  }
};
</script>
