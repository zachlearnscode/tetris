<template>
  <div class="contain preventTouch">
    <div v-for="(row, r) in boardDisplay" :key="r" class="roww">
      <div
        v-for="(col, c) in row"
        :key="r * 10 + c"
        class="cell"
        :class="[
          col,
          ghostCoords.map((c) => c.toString()).includes(`${r},${c}`) &&
          !currentTetromino.currentCoords
            .map((c) => c.toString())
            .includes(`${r + 2},${c}`) &&
          currentTetromino.name !== 'E'
            ? 'G'
            : '',
        ]"
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
import { Empty } from "../Tetrominoes/Empty.js";

export default {
  props: [
    "rotateCW",
    "rotateCCW",
    "moveRight",
    "moveLeft",
    "moveDown",
    "hardDrop",
    "holdPiece",
    "countdown",
  ],

  data() {
    return {
      board: undefined,
      tetrominos: [],
      heldTetromino: undefined,
      linesCleared: null,
    };
  },

  computed: {
    boardDisplay() {
      return this.board?.slice(2);
    },
    currentTetromino() {
      return this.tetrominos[this.tetrominos.length - 1];
    },
    ghostCoords() {
      let [maxRow, maxCol] = this.currentTetromino.getMaxOrigin(this.board);

      return this.currentTetromino.mapToCoords([maxRow - 2, maxCol]);
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

    nextFourTetrominos() {
      let idxOfCurrent = this.tetrominos.indexOf(this.currentTetromino);

      return this.tetrominos.slice(idxOfCurrent - 4, idxOfCurrent).reverse();
    },
    currentLevel() {
      return parseInt(this.linesCleared / 10) + 1;
    },
    speedCurve() {
      let seconds = Math.pow(
        0.8 - (this.currentLevel - 1) * 0.007,
        this.currentLevel - 1
      );
      return parseInt(1000 * seconds);
    },
    gameOver() {
      let prevOrigin = this.currentTetromino?._prevOrigin;

      return !prevOrigin && this.inLockedPosition;
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
        let tetrominos = this.generateTetrominos();
        let randomIdx = Math.floor(Math.random() * 7);

        arr.unshift(tetrominos[randomIdx]);
      }

      return arr;
    },
    lineClear() {
      let rowIdx = Math.max(...this.completedRows);
      let numRows = this.completedRows.length;

      this.clearCompletedRows(this.completedRows);
      this.dropOverheadBlocks(rowIdx, numRows);
    },

    clearCompletedRows(completedRows) {
      let rowCoords = [];

      completedRows.forEach((idx) => {
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
    dropOverheadBlocks(rowIdx) {
      //Get coords of blocks that need to be shifted down.
      this.board
        .filter((row) => {
          let aboveDeepest = this.board.indexOf(row) < rowIdx;
          let containsBlocks = row.some((col) => col);

          return aboveDeepest && containsBlocks;
        })
        .reverse()
        .forEach((row) => {
          let idx = this.board.indexOf(row);
          let idxOfNextOccupiedRow = this.board.findIndex(
            (r, i) => i > idx && r.some((c) => c)
          );

          if (idxOfNextOccupiedRow === -1) {
            idxOfNextOccupiedRow = this.board.length;
          }

          row.forEach((col, c) => {
            this.updateBoard([[idx, c]]);
            this.updateBoard([[idxOfNextOccupiedRow - 1, c]], col);
          });
        });
    },
    holdTetromino() {
      let toHold = this.generateTetrominos().find(
        (t) => t.name === this.currentTetromino.name
      );

      if (!this.heldTetromino || !this.heldTetromino._onHold) {
        this.currentTetromino._interval = clearInterval(
          this.currentTetromino._interval
        );
        this.updateBoard(this.currentTetromino.mapToCoords());

        if (this.heldTetromino) {
          this.$set(
            this.tetrominos,
            this.tetrominos.length - 1,
            this.heldTetromino
          );
        } else {
          this.tetrominos = this.tetrominos.slice(
            0,
            this.tetrominos.length - 1
          );
        }

        this.heldTetromino = toHold;
        this.heldTetromino._onHold = true;
      }
    },
    updateBoard(coords, val = "") {
      coords.forEach((c) => {
        let [row, col] = c;

        this.$set(this.board[row], col, val);
      });
    },
    generateTetrominos() {
      return [new J(), new L(), new I(), new Z(), new S(), new T(), new O()];
    },
  },

  watch: {
    countdown: function() {
      if (this.countdown === 0) {
        this.updateBoard(this.currentTetromino.mapToCoords());
        this.currentTetromino._interval = clearInterval(this.currentTetromino._interval);
        this.tetrominos.pop();
      }
    },
    currentTetromino: {
      handler: function () {
        if (!this.currentTetromino._interval) {
          this.currentTetromino._interval = setInterval(() => {
            this.currentTetromino.move("D", this.board);
          }, this.speedCurve);
        }
        let prevCoords = this.currentTetromino.previousCoords;
        let currCoords = this.currentTetromino.currentCoords;

        if (prevCoords) this.updateBoard(prevCoords);
        this.updateBoard(currCoords, this.currentTetromino.name);

        if (!this.gameOver) {
          if (this.inLockedPosition && !this.currentTetromino._lockDelay) {
            this.currentTetromino._lockDelay = setTimeout(() => {
              if (this.inLockedPosition) {
                this.currentTetromino._interval = clearInterval(
                  this.currentTetromino._interval
                );

                if (this.completedRows.length) {
                  this.lineClear();
                }
                if (this.heldTetromino) {
                  this.heldTetromino._onHold = false;
                }

                this.tetrominos = this.tetrominos.slice(
                  0,
                  this.tetrominos.length - 1
                );
              }

              this.currentTetromino._lockDelay = clearTimeout(
                this.currentTetromino._lockDelay
              );
            }, 500);
          }
        }
      },
      deep: true,
    },
    tetrominos: function () {
      if (this.tetrominos.length < 5) {
        return (this.tetrominos = this.queueTetrominos(this.tetrominos));
      }
    },
    completedRows: function () {
      return (this.linesCleared += this.completedRows.length);
    },
    heldTetromino: function () {
      return this.$emit("on-hold", this.heldTetromino);
    },
    nextFourTetrominos() {
      return this.$emit("next-four", this.nextFourTetrominos);
    },
    currentLevel: function () {
      return this.$emit("current-level", this.currentLevel);
    },
    rotateCW: function () {
      if (this.rotateCW) {
        this.currentTetromino.orientation = { dir: "CW", board: this.board };
      }
    },
    rotateCCW: function () {
      if (this.rotateCCW) {
        this.currentTetromino.orientation = { dir: "CCW", board: this.board };
      }
    },
    moveRight: function () {
      if (this.moveRight) {
        this.currentTetromino.move("R", this.board);
      }
    },
    moveLeft: function () {
      if (this.moveLeft) {
        this.currentTetromino.move("L", this.board);
      }
    },
    moveDown: function () {
      if (this.moveDown) {
        this.currentTetromino.move("D", this.board);
      }
    },
    hardDrop: function () {
      if (this.hardDrop) {
        this.currentTetromino.move("HD", this.board);
      }
    },
    holdPiece: function () {
      if (this.holdPiece) {
        this.holdTetromino();
      }
    },
  },

  created() {
    this.board = this.build();
    this.tetrominos = this.queueTetrominos();
    this.tetrominos.push(new Empty());

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "x") {
        this.currentTetromino.orientation = { dir: "CW", board: this.board };
      } else if (e.key === "Control" || e.key === "z") {
        this.currentTetromino.orientation = { dir: "CCW", board: this.board };
      } else if (e.key === "ArrowLeft") {
        this.currentTetromino.move("L", this.board);
      } else if (e.key === "ArrowRight") {
        this.currentTetromino.move("R", this.board);
      } else if (e.key === "ArrowDown") {
        this.currentTetromino.move("D", this.board);
      } else if (e.key === " ") {
        this.currentTetromino.move("HD", this.board);
      } else if (e.key === "Shift" || e.key === "c") {
        this.holdTetromino();
      }

      e.preventDefault();
    });
  },
};
</script>

<style>
.contain {
  height: calc(65vw * 2);
  max-height: 65vh;
  width: 65vw;
  max-width: calc(65vh / 2);
  display: flex;
  flex-direction: column;
  margin: auto;
  box-shadow: 0px 0px 30px #8c9eff;
}
.roww {
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
}
</style>