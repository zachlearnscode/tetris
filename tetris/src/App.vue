<template>
  <v-app>
    <v-main
      v-tap="testFn"
      v-tap:swipe.down.stop="swipeDown"
      v-tap:moving.stop="moving"
      v-tap:start.stop="start"
      v-tap:end.stop="end"
      class="d-flex justify-center align-center indigo"
    >
      <board
        :rotateCW="rotateCW"
        :rotateCCW="rotateCCW"
        :hardDrop="hardDrop"
        :moveRight="moveRight"
        :moveLeft="moveLeft"
        :moveDown="moveDown"
      ></board>
    </v-main>
  </v-app>
</template>

<script>
import Board from "./components/Board.vue";

export default {
  name: "App",

  components: {
    Board,
  },

  data: () => ({
    rotateCW: false,
    rotateCCW: false,
    hardDrop: false,
    moveRight: false,
    moveLeft: false,
    moveDown: false,

    touchCoords: undefined,
    touchCoordsLocked: false
  }),

  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.name;
    },
    screenWidth() {
      return this.$vuetify.breakpoint.width;
    },
    cellSize() {
      return document.querySelector(".cell").offsetWidth;
    },
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
      }, 100);
    },
    swipeDown() {
      this.hardDrop = true;

      setTimeout(() => (this.hardDrop = false), 100);
    },
    moving(e) {
      //console.log(e)
      let xPos = e.changedTouches[0].pageX;
      let yPos = e.changedTouches[0].pageY;

      if (this.touchCoords[0] - xPos < -17) {
        this.touchCoords = [xPos, yPos];
        this.moveRight = true;

        setTimeout(() => this.moveRight = false, 100);
      } else if (this.touchCoords[0] - xPos > 17) {
        this.touchCoords = [xPos, yPos];
        this.moveLeft = true;

        setTimeout(() => this.moveLeft = false, 100);
      } else if (this.touchCoords[1] - yPos < -17) {
        this.touchCoords = [xPos, yPos];

        this.moveDown = true;

        setTimeout(() => this.moveDown = false, 100);
      }
    },
    start(e) {
      let xPos = e.changedTouches[0].pageX;
      let yPos = e.changedTouches[0].pageY;

      this.touchCoords = [xPos, yPos];
    },
    end() {
      this.touchCoords = undefined;
    },
  },
};
</script>
