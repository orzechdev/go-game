<template>
  <v-app>
    <v-toolbar app dark color="primary">
      <v-toolbar-title class="headline text-uppercase">Go Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/orzechdev/go-game/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <router-view></router-view>

    <v-bottom-nav :active.sync="bottomNav" :value="true" fixed color="white">
      <v-btn color="primary" flat value="play" to="/">
        <span class="font-weight-bold">Play</span>
        <v-icon>play_circle_filled</v-icon>
      </v-btn>

      <v-btn color="primary" flat value="preferences" to="/preferences">
        <span class="font-weight-bold">Preferences</span>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      bottomNav: 'play',
    };
  },
};
</script>
