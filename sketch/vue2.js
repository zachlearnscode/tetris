// class L {
//   constructor(name) {
//     this.name = name,

//     this._origin = [1, 3],
//     this._orientations = [
//       [
//         ["", "", ""],
//         ["L", "L", "L"],
//         ["", "", "L"],
//       ],
//       [
//         ["", "L", ""],
//         ["", "L", ""],
//         ["L", "L", ""],
//       ],
//       [
//         ["L", "", ""],
//         ["L", "L", "L"],
//         ["", "", ""],
//       ],
//       [
//         ["", "L", "L"],
//         ["", "L", ""],
//         ["", "L", ""],
//       ],
//     ],

//     this._interval = null,
//     this._isLocked = false,

//     this._prevCoords = undefined
//   }

//   get orientation() {
//     return this._orientations[0];
//   }

//   set orientation({dir, board}) {
//     let requestedOrientation;

//     if (dir === "CW") {
//       requestedOrientation = this._orientations
//         .slice(1).concat(this._orientations.slice(0, 1));
//     } else if (dir === "CCW") {
//       requestedOrientation = this._orientations
//         .slice(3).concat(this._orientations.slice(0, 3));
//     }

//     let orientationIsValid = this.simulatePosition(this._origin, requestedOrientation[0], board);

//     if (orientationIsValid) {
//       this._prevCoords = this.mapToCoords();
//       return this._orientations = requestedOrientation;
//     }

//     return;
//   }

//   move(dir, board) {
//     switch (dir) {
//       case "D": {
//         dir = [1, 0];
//         break;
//       }
//       case "L": {
//         dir = [0, -1];
//         break;
//       }
//       case "R": {
//         dir = [0, 1];
//         break;
//       }
//       default: {
//         dir = [0, 0];
//         break;
//       }
//     }

//     let requestedOrigin = [this._origin[0] + dir[0], this._origin[1] + dir[1]];
//     let moveIsValid = this.simulatePosition(requestedOrigin, this.orientation, board);

//     if (moveIsValid) {
//       this._prevCoords = this.mapToCoords();
//       return this._origin = requestedOrigin;
//     }

//     return;
//   }

//   simulatePosition(origin, orientation, board) {
//     // Accept a requested origin or orientation and the current board to simulate a requested position
//     // for the tetromino. Ensure that requested position won't move the tetromino out of bounds and won't
//     // collide with an already-placed piece. Exclude the tetromino's current coordinates on the board.
//     let result = true;

//     let coordsNow = this.mapToCoords().map(c => c.toString());
//     let requestedCoords = this.mapToCoords(origin, orientation);

//     requestedCoords.forEach(requestedCoord => {
//       let [row, col] = requestedCoord;
//       if (!coordsNow.includes(requestedCoord.toString())) {
//         if (col < 0 || col >= 10 || row >= 22 || board[row][col]) {
//           result = false;
//           if (row >= 22 || board[row][col]) {
//             this._isLocked = true;
//             if (this._interval) {
//               clearInterval(this._interval);
//             }
//           }
//         }
//       }
//     })

//     return result;
//   }

//   mapToCoords(origin = this._origin, orientation = this.orientation) {
//     let result = [];

//     for (let r = 0; r < orientation.length; r++) {
//       let row = origin[0] + r;
//       for (let c = 0; c < orientation[r].length; c++) {
//         let col = origin[1] + c;
//         if (orientation[r][c]) {
//           result.push([row, col]);
//         }
//       }
//     }

//     return result;
//   }
// }

import { J } from "./tetrominos/J.js";
import { L } from "./tetrominos/L.js";
import { I } from "./tetrominos/I.js";
import { Z } from "./tetrominos/Z.js";
import { S } from "./tetrominos/S.js";
import { T } from "./tetrominos/T.js";
import { O } from "./tetrominos/O.js";

var app = new Vue({
  el: "#app",
  data: {
    board: undefined,
    tetrominos: [],
    timeout: null,
    addTetrominoTimeout: null,
    hardDropped: false,
    linesCleared: 0
  },
  computed: {
    currentTetromino() {
      return this.tetrominos[this.tetrominos.length - 1];
    },
    ghostOfCurrentTetromino() {
      let maxOrigin = this.currentTetromino.getMaxOrigin(this.board);
      let ghostCoords = this.currentTetromino.mapToCoords(maxOrigin);

      return ghostCoords.map(c => c.toString())
    },
    currentLevel() {
      return parseInt(this.linesCleared / 10) + 1;
    },
    speedCurve() {
      let seconds = Math.pow(0.8 - ((this.currentLevel - 1) * 0.007), this.currentLevel - 1);
      return 1000 * seconds;
    },
    gameOver() {
      return !this.currentTetromino?._prevCoords && this.inLockedPosition();
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
    addTetromino() {
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

      let newTetromino = tetrominos[randomIdx];

      if (this.currentTetromino) {
        clearInterval(this.currentTetromino._interval);
      }

      newTetromino._interval = setInterval(() => {
        newTetromino.move("D", this.board)
      }, this.speedCurve)

      this.tetrominos.push(newTetromino);
    },
    lineClear(completedRows) {
      this.linesCleared += completedRows.length;

      this.clearCompletedRows(completedRows);
      this.dropOverheadBlocks(completedRows);
    },
    getCompletedRows() {
      let completedRows = this.board
        .filter((row) => row.every((col) => col))
        .map((completedRow) => this.board.indexOf(completedRow));

      return completedRows;
    },
    clearCompletedRows(completedRows) {
      return completedRows.forEach((r) => {
        this.board[r].forEach((c, i) => this.$set(this.board[r], i, ""));
      });
    },
    getOverheadBlockCoords(rowIdx) {
      //For use during line clears.
      let overheadBlocks = [];
      
      //Compute coords for all cells in rows containing blocks above given rowIdx.
      this.board
        .filter((row) => {
          return this.board.indexOf(row) < rowIdx && row.some((col) => col)
        })
        .forEach((row) => {
          let r = this.board.indexOf(row);
          row.forEach((col, c) => {
            overheadBlocks.push([r, c]);
          })
        })

      //Sort from lowest row to highest row.
      overheadBlocks.reverse();

      return overheadBlocks;
    },
    dropOverheadBlocks(clearedRows) {
      let numRows = clearedRows.length;
      let overheadBlocks = this.getOverheadBlockCoords(Math.max(...clearedRows));

      //Find and set new coords for each overhead block.
      overheadBlocks.forEach((coord) => {
        let [row, col] = coord;

        let char;
        if (this.board[row][col]) {
          char = this.board[row][col];
        } else {
          char = '';
        }

        this.$set(this.board[row], col, "");
        this.$set(this.board[row + numRows], col, char);
      });
    },
    inLockedPosition() {
      let result = false;

      let coords = this.currentTetromino?.mapToCoords();
      let strCoords = coords?.map(c => c.toString());

      coords?.forEach((c) => {
        let [row, col] = c;
        if (row === this.board.length - 1) {
          result = true;
        } else if (this.board[row + 1]) {
          if (this.board[row + 1][col] && !strCoords.includes(`${row + 1},${col}`)) {
            result = true;
          }
        }
      });

      return result;
    },
    lockCurrentTetromino() {
      //Create lock delay before locking tetromino.
      //Lock delay void if tetromino was hard-dropped --
      //hard-drop tracked in Tetromino move method.
      this.timeout = setTimeout(() => {
        if (this.inLockedPosition()) {
          let completedRows = this.getCompletedRows();
          if (completedRows.length) {
            this.lineClear(completedRows);
          }
          this.addTetromino();
        }
        clearTimeout(this.timeout);
      }, this.speedCurve);
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
        let prevCoords = this.currentTetromino._prevCoords;
        let currCoords = this.currentTetromino.mapToCoords();

        if (prevCoords) this.updateBoard(prevCoords);
        this.updateBoard(currCoords, this.currentTetromino.name);

        if (!this.gameOver) {
          if (this.inLockedPosition()) { 
            this.lockCurrentTetromino();
          }
        }
      },
      deep: true,
    },
    gameOver: function() {
      if (this.gameOver) {
        clearInterval(this.currentTetromino._interval);
        console.log("Game Over");
      }
    }
  },

  created() {
    this.board = this.build();
    this.addTetromino();

    window.addEventListener("keydown", (e) => {
      if (e.key === "w") {
          this.currentTetromino.orientation = { dir: "CW", board: this.board };
      } else if (e.key === "a") {
          this.currentTetromino.move("L", this.board);
      } else if (e.key === "d") {
          this.currentTetromino.move("R", this.board);
      } else if (e.key === "s") {
          this.currentTetromino.move("D", this.board);
      } else if (e.key === "e") {
          this.currentTetromino.move("HD", this.board);
      }

      e.preventDefault();
    });
  },
});
