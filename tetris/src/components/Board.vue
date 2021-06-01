<template>
  <div class="container d-flex justify-center align-center">
    <div v-for="(row, r) in boardDisplay" :key="r" class="row">
      <div v-for="(col, c) in row" :key="(r * 10) + c" class="cell">{{col}}</div>
    </div>
  </div>
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

  watch: {
    tetrominos: function() {
      if (this.tetrominos.length < 5) {
        this.tetrominos = this.queueTetrominos(this.tetrominos);
      }
    }
  },

  created() {
    this.board = this.build();
    this.tetrominos = this.queueTetrominos();
  },
};
</script>

<style scoped>
.container {
  height:75vh;
  width:calc(75vh / 2);
  display:flex;
  flex-direction: column;
  margin: auto;
  box-sizing: content-box;
  border: 5px solid black;
  border-radius: 3px;
}
.row {
  width:100%;
  height:calc(100% / 20);
  display: flex;
}
.cell {
  display: inline;
  aspect-ratio: 1/1;
  background-color: #1A237E;

}
</style>