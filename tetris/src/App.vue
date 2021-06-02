<template>
  <v-app>
    <v-main v-tap="testFn" class="d-flex justify-center align-center indigo">
      
      <board :rotateCW="rotateCW" :rotateCCW="rotateCCW"></board>

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
    rotateCW: false,
    rotateCCW: false
  }),

  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.name;
    },
    screenWidth() {
      return this.$vuetify.breakpoint.width;
    }
  },

  methods: {
    testFn(e) {
      let touch = e.changedTouches[0];
      let x = touch.screenX;

      if (x > this.screenWidth / 2) {
        this.rotateCW = true;
      } else {
        this.rotateCCW = true;
      }

      setTimeout(() => {
        this.rotateCW = false;
        this.rotateCCW = false;
      }, 100)
      // console.log(e.changedTouches)
    }
  }
};
</script>
