<template>
  <div class="container d-flex justify-center align-center">
    <div v-for="(row, r) in boardDisplay" :key="r" class="row">
      <div
        v-for="(col, c) in row"
        :key="r * 10 + c"
        class="cell"
        :class="col"
      ></div>
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
      linesCleared: 0,
      lockDelay: null,
    };
  },

  computed: {
    boardDisplay() {
      return this.board?.slice(2);
    },
    currentTetromino() {
      return this.tetrominos[this.tetrominos.length - 1];
    },
    inLockedPosition() {
      let currentCoords = this.currentTetromino.mapToCoords();
      let currentCoordsAsStrings = currentCoords.map((c) => c.toString());

      let lockedCoords = currentCoords.filter((c) => {
        let [row, col] = c;
        if (row === this.board.length - 1) {
          return c;
        } else if (this.board[row + 1]) {
          if (
            this.board[row + 1][col] &&
            !currentCoordsAsStrings.includes(`${row + 1},${col}`)
          ) {
            return c;
          }
        }
      });

      return lockedCoords.length > 0;
    },
    completedRows() {
      return this.board
        ?.filter((row) => {
          return row.every((col) => col);
        })
        .map((completedRow) => {
          return this.board.indexOf(completedRow);
        });
    },
    currentLevel() {
      return parseInt(this.linesCleared / 10) + 1;
    },
    speedCurve() {
      let seconds = Math.pow(
        0.8 - (this.currentLevel - 1) * 0.007,
        this.currentLevel - 1
      );
      return 1000 * seconds;
    },
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

      while (arr.length < 100) {
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

        arr.unshift(tetrominos[randomIdx]);
      }

      return arr;
    },
    lineClear() {
      let rowIdx = Math.min(...this.completedRows);
      let numRows = this.completedRows.length;

      this.clearCompletedRows();
      this.dropOverheadBlocks(rowIdx, numRows);
    },

    clearCompletedRows() {
      let rowCoords = [];

      this.completedRows.forEach((idx) => {
        let row = [];

        while (row.length < 10) {
          row.push([idx, row.length]);
        }

        rowCoords.push(row);
      });

      //Pass coordiantes to update board to be wiped clear.
      rowCoords.forEach((c) => {
        this.updateBoard(c);
      });
    },
    dropOverheadBlocks(rowIdx, numRows) {
      let coords = [];

      //Get coords of blocks that need to be shifted down.
      this.board
        .filter((row) => {
          let aboveDeepest = this.board.indexOf(row) < rowIdx;
          let containsBlocks = row.some((col) => col);

          return aboveDeepest && containsBlocks;
        })
        .forEach((row) => {
          let r = this.board.indexOf(row);
          row.forEach((col, c) => {
            coords.push([r, c]);
          });
        });

      //Take value of each coord and move it down by numRows cleared.
      coords.reverse().forEach((coord) => {
        let [row, col] = coord;
        let val = this.board[row][col];

        this.updateBoard([coord]);
        this.updateBoard([[row + numRows, col]], val);
      });
    },
    updateBoard(coords, val = "") {
      coords.forEach((c) => {
        let [row, col] = c;

        this.$set(this.board[row], col, val);
      });
    },
  },

  watch: {
    currentTetromino: {
      handler: function () {
        if (!this.currentTetromino._interval) {
          this.currentTetromino._interval = setInterval(() => {
            this.currentTetromino.move("D", this.board);
          }, this.speedCurve);
        }
        let prevCoords = this.currentTetromino.mapToCoords(this.currentTetromino._prevOrigin, this.currentTetromino._prevOrientation);
        let currCoords = this.currentTetromino.mapToCoords();

        if (prevCoords) this.updateBoard(prevCoords);
        this.updateBoard(currCoords, this.currentTetromino.name);

        if (!this.gameOver) {
          if (this.inLockedPosition && !this.currentTetromino._lockDelay) {
            this.currentTetromino._lockDelay = setTimeout(() => {
              if (this.inLockedPosition) {
                this.tetrominos = this.tetrominos.slice(0, this.tetrominos.length - 1);
              }
            }, 1000);
          }
        }
      },
      deep: true,
    },
    tetrominos: function () {
      if (this.tetrominos.length < 5) {
        this.tetrominos = this.queueTetrominos(this.tetrominos);
      }
    },
    completedRows: function () {
      this.linesCleared += this.completedRows.length;
    },
  },

  created() {
    this.board = this.build();
    this.tetrominos = this.queueTetrominos();
  },
};
</script>

<style scoped>
.container {
  height: 60vh;
  width: calc(60vh / 2);
  display: flex;
  flex-direction: column;
  margin: auto;
  box-shadow: 0px 0px 30px #8c9eff;
}
.row {
  width: 100%;
  height: calc(100% / 20);
  display: flex;
}
.cell {
  display: inline;
  height: 100%;
  width: 10%;
  background-color: #1a237e;
}
.I {
  background-color: #26c6da;
  border: 0.5px solid #00acc1;
}
.J {
  background-color: #42a5f5;
  border: 0.5px solid #1e88e5;
}
.L {
  background-color: #ffa726;
  border: 0.5px solid #fb8c00;
}
.O {
  background-color: #ffee58;
  border: 0.5px solid #fdd835;
}
.S {
  background-color: #66bb6a;
  border: 0.5px solid #43a047;
}
.T {
  background-color: #ab47bc;
  border: 0.5px solid #8e24aa;
}
.Z {
  background-color: #ef5350;
  border: 0.5px solid #e53935;
}
.G {
  background-color: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
}
</style>