<template>
  <v-app>
    <v-main class="d-flex justify-center align-center">
      <v-container :fluid="screenSize === 'xs'">
        <v-row>
          <v-col class="d-flex justify-center align-center">
            <board></board>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Board from './components/Board.vue';

export default {
  name: 'App',

  components: {
    Board
  },

  data: () => ({
    //
  }),

  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.name;
    }
  }
};
</script>
