<template>
  <v-app style="user-select:none;">
    <v-main
      v-tap="rotate"
      v-tap:swipe.bottom="swipeDown"
      v-tap:swipe.top="swipeUp"
      v-tap:moving="moving"
      v-tap:start="start"
      v-tap:end="end"
      class="d-flex justify-center align-center indigo"
      style="touch-action: none"
    >
      <v-container fluid class="py-0">
        <v-row class="justify-center space-between">
          <v-col cols="auto" class="pa-0">
            <board
              @next-four="nextFour = $event"
              @on-hold="onHold = $event"
              @current-level="currentLevel = $event"
              :rotateCW="rotateCW"
              :rotateCCW="rotateCCW"
              :hardDrop="hardDrop"
              :holdPiece="holdPiece"
              :moveRight="moveRight"
              :moveLeft="moveLeft"
              :moveDown="moveDown"
            ></board>
          </v-col>
          <v-col cols="auto" class="d-flex flex-column justify-space-between py-0">
            <div>
              <tray :items="nextFour" :screenSize="screenSize"></tray>
              <tray :items="onHold ? [onHold] : onHold" :screenSize="screenSize" class="mt-3"></tray>
            </div>
            <span class="white--text text-uppercase text-center">Level {{currentLevel}}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Board from "./components/Board.vue";
import Tray from "./components/Tray.vue";
//import OnHold from "./components/OnHold.vue";

export default {
  name: "App",

  metaInfo: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },

  components: {
    Board,
    Tray,
    //OnHold
  },

  data: () => ({
    rotateCW: false,
    rotateCCW: false,
    hardDrop: false,
    holdPiece: false,
    moveRight: false,
    moveLeft: false,
    moveDown: false,
    movingDown: false,

    benchmarkTouchCoords: undefined,
    consecutiveTouchEvents: 0,

    nextFour: undefined,
    onHold: undefined,
    currentLevel: undefined
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
    rotate(e) {
      let touch = e.changedTouches[0];

      if (touch.screenX > this.screenWidth / 2) {
        this.rotateCW = true;
        this.$nextTick(() => this.rotateCW = false);
      } else {
        this.rotateCCW = true;
        this.$nextTick(() => this.rotateCCW = false);
      }
    },
    swipeDown() {
      if (this.consecutiveTouchEvents < 12) {
        this.hardDrop = true;
        this.$nextTick(() => this.hardDrop = false);
      }
    },
    swipeUp() {
      this.holdPiece = true;
      this.$nextTick(() => this.holdPiece = false);
    },
    moving(e) {
      this.consecutiveTouchEvents++;

      let [benchmarkX, benchmarkY] = this.benchmarkTouchCoords;
      let xPos = e.changedTouches[0].pageX;
      let yPos = e.changedTouches[0].pageY;

      if (benchmarkX - xPos < -(this.cellSize)) {
        this.benchmarkTouchCoords = [xPos, yPos];
        this.moveRight = true;

        this.$nextTick(() => this.moveRight = false);
      } else if (benchmarkX - xPos > this.cellSize) {
        this.benchmarkTouchCoords = [xPos, yPos];
        this.moveLeft = true;

        this.$nextTick(() => this.moveLeft = false);
      } else if (benchmarkY - yPos < -(this.cellSize)) {
        this.benchmarkTouchCoords = [xPos, yPos];
        this.moveDown = true;

        this.$nextTick(() => this.moveDown = false);
      }

      return;
    },
    start(e) {
      let xPos = e.changedTouches[0].pageX;
      let yPos = e.changedTouches[0].pageY;

      return this.benchmarkTouchCoords = [xPos, yPos];
    },
    end() {
      this.$nextTick(() => {
        this.consecutiveTouchEvents = 0;
        this.benchmarkTouchCoords = undefined;
      });
    },
  },
};
</script>
