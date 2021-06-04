<template>
  <v-app>
    <v-main
      v-tap="testFn"
      v-tap:swipe.down.prevent="swipeDown"
      v-tap:moving.prevent="moving"
      v-tap:start.prevent="start"
      v-tap:end.prevent="end"
      class="d-flex justify-center align-center indigo"
      style="touch-action: none"
    >
      <v-container class="pa-0">
        <v-row class="justify-center space-around">
          <v-col cols="auto" class="pa-0">
            <on-hold :onHold="onHold"></on-hold>
          </v-col>
          <v-col cols="auto" class="pa-0">
            <board
              @next-four="nextFour = $event"
              @on-hold="onHold = $event"
              :rotateCW="rotateCW"
              :rotateCCW="rotateCCW"
              :hardDrop="hardDrop"
              :moveRight="moveRight"
              :moveLeft="moveLeft"
              :moveDown="moveDown"
            ></board>
          </v-col>
          <v-col cols="auto" class="py-0">
            <next-four :nextFour="nextFour"></next-four>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Board from "./components/Board.vue";
import NextFour from "./components/NextFour.vue";
import OnHold from "./components/OnHold.vue";

export default {
  name: "App",

  components: {
    Board,
    NextFour,
    OnHold
  },

  data: () => ({
    rotateCW: false,
    rotateCCW: false,
    hardDrop: false,
    moveRight: false,
    moveLeft: false,
    moveDown: false,

    touchCoords: undefined,
    touchCoordsLocked: false,

    nextFour: undefined,
    onHold: undefined
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
    testFn2(e) {
      console.log(e)
    },
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

        setTimeout(() => (this.moveRight = false), 100);
      } else if (this.touchCoords[0] - xPos > 17) {
        this.touchCoords = [xPos, yPos];
        this.moveLeft = true;

        setTimeout(() => (this.moveLeft = false), 100);
      } else if (this.touchCoords[1] - yPos < -17) {
        this.touchCoords = [xPos, yPos];

        this.moveDown = true;

        setTimeout(() => (this.moveDown = false), 100);
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
