<template>
  <v-app>
    <v-main class="d-flex justify-center align-center indigo">
      
      <board></board>

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
