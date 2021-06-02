<template>
  <v-app>
    <v-main
      v-tap="testFn"
      v-tap:swipe.down.prevent="swipeDown"
      v-tap:start.prevent="touchStart"
      v-tap:moving="moving"
      v-tap:end="end"
      class="d-flex justify-center align-center indigo"
    >
      <board
        :rotateCW="rotateCW"
        :rotateCCW="rotateCCW"
        :hardDrop="hardDrop"
        :moveRight="moveRight"
        :moveLeft="moveLeft"
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

    pageX: undefined
  }),

  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.name;
    },
    screenWidth() {
      return this.$vuetify.breakpoint.width;
    },
    cellSize() {
      return document.querySelector('.cell').offsetWidth;
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
      }, 100);
      // console.log(e.changedTouches)
    },
    swipeDown() {
      this.hardDrop = true;

      setTimeout(() => (this.hardDrop = false), 100);
    },
    touchStart(e) {
      this.pageX = e.changedTouches[0].pageX;
      // console.log(e.changedTouches[0])
    },
    moving(e) {
      let pos = e.changedTouches[0].pageX;
      //console.log(pos)

      if (pos >= 0 && pos <= this.screenWidth) {
        if (!this.pageX) {
          this.pageX = pos;
        } else {
          if (this.pageX - pos < -17) {
            this.moveRight = true;
            setTimeout(() => {
              this.moveRight = false
            }, 100);

            this.pageX = pos;
          } else if (this.pageX - pos > 17) {
            this.moveLeft = true;
            setTimeout(() => {
              this.moveLeft = false
            }, 100);
            this.pageX = pos;
          }
        }
      }
      // this.pageX = e.changedTouches[0].pageX;
      // console.log(this.pageX)
    },
    end() {
      this.pageX = null
    },
    longTap() {
      this.moveRight = false;
      this.moveLeft = false;
    }
  },
};
</script>
