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
    timeout: null
  },
  computed: {
    currentTetromino() {
      return this.tetrominos[this.tetrominos.length - 1];
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
      newTetromino._interval = setInterval(() => {
        newTetromino.move("D", this.board)
      }, 1000)

      this.tetrominos.push(newTetromino);
    },
    pause() {
      clearInterval(app.currentTetromino._interval);
    },
    getOverheadBlockCoords(rowIdx) {
      //For use during line clears.
      let overheadBlocks = [];

      //Compute coords for blocks above given rowIdx.
      this.board
        .filter((row) => this.board.indexOf(row) < rowIdx)
        .filter((row) => row.some((col) => col))
        .forEach((row) => {
          row.forEach((col, c) => {
            let r = this.board.indexOf(row);
            if (col) return overheadBlocks.push([r, c]);
          });
        });

      //Sort from lowest row to highest row.
      overheadBlocks.reverse();

      return overheadBlocks;
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
    dropOverheadBlocks(clearedRows) {
      let numRows = clearedRows.length;
      let overheadBlocks = this.getOverheadBlockCoords(Math.max(...clearedRows));

      //Find and set new coords for each overhead block.
      overheadBlocks.forEach((coord) => {
        let [row, col] = coord;
        let char = this.board[row][col];

        this.$set(this.board[row], col, "");
        this.$set(this.board[row + numRows], col, char);

        // let r = row + 1;
        // let set = false;
        // while (r < this.board.length) {
        //   if (this.board[r][col] && !set) {
        //     this.$set(this.board[row], col, "");
        //     this.$set(this.board[r - 1], col, char);
        //     set = true;
        //   }
        //   r++;
        // }

        // if (!set) {
        //   this.$set(this.board[row], col, "");
        //   coord = this.$set(this.board[r - 1], col, char);
        // }
      });
    },
    lineClear(completedRows) {
      this.clearCompletedRows(completedRows);
      this.dropOverheadBlocks(completedRows);
    },
    updateBoard(coords, val = "") {
      coords.forEach((c) => {
        let [row, col] = c;

        this.$set(this.board[row], col, val);
      });
    },
    statusOfCurrentTetromino() {
      let result = "free";

      let coords = this.currentTetromino.mapToCoords();
      let strCoords = coords.map(c => c.toString());

      coords.forEach((c) => {
        let [row, col] = c;
        if (row === this.board.length - 1) {
          result = "locked";
        }

        if (this.board[row + 1]) {
          if (
            this.board[row + 1][col] &&
            !strCoords.includes(`${row + 1},${col}`)
          ) {
            result = "locked";
          }
        }
      });

      return result;
    },
  },
  watch: {
    currentTetromino: {
      handler: function () {
        let prevCoords = this.currentTetromino._prevCoords;
        let currCoords = this.currentTetromino.mapToCoords();

        if (prevCoords) this.updateBoard(prevCoords);
        this.updateBoard(currCoords, this.currentTetromino.name);

        if (this.statusOfCurrentTetromino() === "locked") {
          this.timeout = setTimeout(() => {
            if (this.statusOfCurrentTetromino() === "locked") {
              let completedRows = this.getCompletedRows();
           
              this.lineClear(completedRows);
           
              clearInterval(this.currentTetromino._interval);
              this.addTetromino();

              clearTimeout(this.timeout);
            } else{
              return
            }

            
          }, 500)          
        }
      },
      deep: true,
    },
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
      }

      e.preventDefault();
    });
  },
});
