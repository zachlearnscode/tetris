<template>
  <v-container class="d-flex flex-column align-center">
    <v-row v-for="(row, r) in boardDisplay" :key="r">
      <v-col cols="auto" v-for="(col, c) in row" :key="(r * 10) + c" class="cell">{{col}}</v-col>
    </v-row>
  </v-container>
</template>

<script>
import { J } from "../Tetrominoes/J.js";
import { L } from "../Tetrominoes/L.js";
import { I } from "../Tetrominoes/I.js";
import { Z } from "../Tetrominoes/Z.js";
import { S } from "../Tetrominoes/S.js";
import { T } from "../Tetrominoes/T.js";
import { O } from "../Tetrominoes/O.js";

export default {
  data() {
    return {
      board: undefined,
      tetrominos: [],
    };
  },

  computed: {
    boardDisplay() {
      return this.board?.slice(2);
    }
  },

  methods: {
    build() {
      let board = [];

      for (let r = 0; r < 22; r++) {
        let row = [];
        for (let c = 0; c < 10; c++) {
          row[c] = "";
        }
        board[r] = row;
      }

      return board;
    },
    queueTetrominos(arr = []) {
      if (arr.length) {
        arr = arr.slice();
      }

      let tetrominos = [
        new J(),
        new L(),
        new I(),
        new Z(),
        new S(),
        new T(),
        new O(),
      ];
      let randomIdx = Math.floor(Math.random() * 7);

      while (arr.length < 100) {
        arr.unshift(tetrominos[randomIdx]);
      }

      return arr;
    },
  },

  created() {
    this.board = this.build();
    this.tetrominos = this.queueTetrominos();
  },
};
</script>

<style scoped>
.cell {
  /* display: inline; */
  /* aspect-ratio: 1/1; */
  background-color: blue;
}
</style>