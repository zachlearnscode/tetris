class Tetromino {
  constructor() {
    this.prevCoords = [];

    this.intervalId = setInterval(() => {
      this.coords = this.move("down");
    }, 1000);
  }

  get atLowerBound() {
    return this.coords.filter((c) => c[0] === 19).length ? true : false;
  }

  get aboveOccupiedCoord() {
    let placed = app.occupiedCoordinates.slice(0, app.occupiedCoordinates.length - 4).map((c) => c.toString());

    let coordsAboveOccupiedCoords = this.coords.filter((c) => {
      let [row, col] = c;

      return placed.includes(`${row + 1},${col}`);
    });

    return coordsAboveOccupiedCoords.length ? true : false;
  }

  get isPlaced() {
    //Square is placed if any of its coords row value is at the bottom of the board
    //or any of its coords values is one row above an placed shape in the same column.
    return this.atLowerBound || this.aboveOccupiedCoord;
  }

  move(direction) {
    let result = this.coords;

    //Parse given direction.
    switch (direction) {
      case "left":
        direction = [0, -1];
        break;
      case "right":
        direction = [0, 1];
        break;
      case "down":
        direction = [1, 0];
        break;
      default:
        direction = [0, 0];
        break;
    }

    let [toRow, toCol] = direction;

    //Check validity of given direction.
    let outOfBounds = this.coords.filter((c) => {
      let [row, col] = c;

      return (
        row + toRow < 0 ||
        row + toRow >= 20 ||
        col + toCol < 0 ||
        col + toCol >= 10 ||
        app.board[row + toRow][col] === "P" ||
        app.board[row][col + toCol] === "P"
      );
    });

    if (!outOfBounds.length && !this.isPlaced) {
      //Side effect sets value of prevCoords
      this.coords.forEach((c, i) => (this.prevCoords[i] = [c[0], c[1]]));

      //Update coords to reflect given direction
      result = result.map((t) => {
        t[0] += toRow;
        t[1] += toCol;

        return t;
      });
    }

    //Return updated coords
    return result;
  }

  rotate(dir = "CW") {
    let result = this.coords;

    let anchorPoint = this.coords[0];
    let rotatingPoints = this.coords.filter((c) => c !== anchorPoint);

    let newCoordsForRotatingPoints = rotatingPoints.map((point) => {
      let [row, col] = point;
      let [anchorRow, anchorCol] = anchorPoint;

      let rowDistanceFromOrigin = row - anchorRow;
      let colDistanceFromOrigin = col - anchorCol;

      return dir === "CW"
        ? [
            anchorRow - -colDistanceFromOrigin,
            anchorCol - rowDistanceFromOrigin,
          ]
        : [
            anchorRow + -colDistanceFromOrigin,
            anchorCol + rowDistanceFromOrigin,
          ];
    });

    let outOfBounds = newCoordsForRotatingPoints.filter((p) => {
      let [row, col] = p;

      return row < 0 || row >= 20 || col < 0 || col >= 10;
    });

    if (!outOfBounds.length) {
      this.coords.forEach((c, i) => (this.prevCoords[i] = [c[0], c[1]]));

      result = [anchorPoint, ...newCoordsForRotatingPoints];
    }

    return result;
  }
}

class O extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "O",
    this.coords = [
      [0, 4],
      [0, 5],
      [1, 5],
      [1, 4],
    ];
  }

  rotate() {
    return this.coords;
  }
}

class I extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "I",
    this.coords = [
      [0, 5],
      [0, 3],
      [0, 4],
      [0, 6],
    ];
  }

  rotate() {
    //Detemine horizontal v. vertical orientation.
    //Rotate 90 degrees CW in horizontal orientation.
    //Rotate 90 degress CCW in veritcal orientation.

    let [anchorRow, anchorCol] = this.coords[0];

    let horizontal = this.coords.every((c) => c[0] === anchorRow);
    let vertical = this.coords.every((c) => c[1] === anchorCol);

    if (horizontal) {
      return super.rotate();
    } else if (vertical) {
      return super.rotate("CCW");
    }
  }
}

class T extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "T",
    this.coords = [
      [0, 4],
      [0, 3],
      [0, 5],
      [1, 4],
    ];
  }
}

class Z extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "Z",
    this.coords = [
      [0, 4],
      [0, 3],
      [1, 5],
      [1, 4],
    ];
  }
}

class S extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "S",
    this.coords = [
      [0, 5],
      [0, 4],
      [1, 4],
      [1, 3],
    ];
  }
}

class J extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "J",
    this.coords = [
      [0, 4],
      [0, 3],
      [0, 5],
      [1, 5],
    ];
  }
}

class L extends Tetromino {
  constructor(prevCoords, intervalId) {
    super(prevCoords, intervalId);
    this.name = "L",
    this.coords = [
      [0, 4],
      [0, 3],
      [0, 5],
      [1, 3],
    ];
  }
}

var app = new Vue({
  el: "#app",
  data() {
    return {
      board: undefined,
      tetrominos: [],
    };
  },

  computed: {
    currentTetromino() {
      return this.tetrominos[this.tetrominos.length - 1];
    },
    lockedTetrominos() {
      return this.tetrominos.slice(0, this.tetrominos.length - 1);
    },
    occupiedCoordinates() {
      let result = [];
      
      this.tetrominos
        //.filter(t => t !== this.currentTetromino)
        .map((t) => t.coords)
        .forEach((c) => result.push(...c));

      return result;
    },
    unoccupiedCoordinates() {
      let result = [];

      this.board?.forEach((row, r) => {
        row.forEach((col, c) => {
          if (col === "O") {
            result.push([r, c]);
          }
        })
      })

      return result;
    },
    completedRows() {
      let result = [];

      //Result will contain index of board completed row
      this.board?.forEach((row, r) => {
        if (row.every((c) => c === "P")) {
          result.push(r);
        }
      });

      return result;
    },
  },

  methods: {
    build() {
      let board = [];

      for (let r = 0; r < 20; r++) {
        let row = [];
        for (let c = 0; c < 10; c++) {
          row[c] = "O";
        }
        board[r] = row;
      }

      return board;
    },
    updateBoard(arr, val) {
      arr.forEach((c) => {
        let [row, col] = c;
        //console.log(row, col)
        return this.$set(this.board[row], col, val);
      });
    },
    selectNextTetromino() {
      let pieces = [
        new O(),
        new I(),
        new T(),
        new Z(),
        new S(),
        new J(),
        new L(),
      ];

      let randomIdx = Math.floor(Math.random() * 7);

      return pieces[randomIdx];
    },
  },

  watch: {
    currentTetromino: {
      handler: function () {
        // let cur = this.currentTetromino.coords;
        // let pre = this.currentTetromino.prevCoords;

        // //Update board to reflect currentTetromino's new position.
        // //this.updateBoard(pre, "O");
        // this.updateBoard(cur, "C");

        // //Add new game piece if currentTetromino is set.
        if (this.currentTetromino.isPlaced) {
          this.currentTetromino.intervalId = clearInterval(
            this.currentTetromino.intervalId
          );

          if (this.board[0][4] === "O") {
            this.tetrominos.push(this.selectNextTetromino());
          } else {
            console.log("Game Over");
          }
        }
      },
      deep: true,
    },
    occupiedCoordinates: {
      handler: function () {
        let current = this.occupiedCoordinates
          .slice(this.occupiedCoordinates.length - 4);
        let placed = this.occupiedCoordinates
          .slice(0, this.occupiedCoordinates.length - 4);

        this.tetrominos.forEach(t => {
          let arr = t.coords;
          let val = t.name;

          this.updateBoard(arr, val);
        })
        // this.updateBoard(current, "C");
        // this.updateBoard(placed, "P");
        // this.updateBoard(this.unoccupiedCoordinates, "O");
      },
      deep: true,
    },
    unoccupiedCoordinates
    
    completedRows: function () {
      //Create a group of the coords remaining above the highest-indexed completed row.
      let numRowsCleared = this.completedRows.length;
      let idxOfDeepestCompletedRow = Math.max(...this.completedRows);

      //Find occupied coords whose row value matches the index of any of the completed rows.
      let coordsInCompletedRows = this.occupiedCoordinates.filter((c) => {
        let row = c[0];
        return this.completedRows.includes(row);
      });

      coordsInCompletedRows.forEach((coord) => {
        let [row, col] = coord;
        //Locate the tetromino that the coord belongs to.
        let parentTetromino = this.tetrominos.find((t) =>
          t.coords.includes(coord)
        );

        //Reset its coords to exclude the current coord.
        parentTetromino.coords = parentTetromino.coords.filter(
          (c) => c !== coord
        );
      });

      

      let coordinatesToMoveDown = this.occupiedCoordinates.slice(0, this.occupiedCoordinates.length - 4).filter((c) => {
        let row = c[0];
        return row < idxOfDeepestCompletedRow;
      });

      coordinatesToMoveDown.sort((a, b) => b[0] - a[0]);

      //Set row value of remaining coords to the sum of the coords row value + the difference between the row value and the deepest compelted row.
      coordinatesToMoveDown.forEach(c => {
        //debugger
        let [row, col] = c;

        let possibleNewCoords = this.unoccupiedCoordinates.filter(oc => {
          return oc[0] > row && oc[1] === col;
        })

        let newCoord = possibleNewCoords.sort((a, b) => b[0] - a[0])[0]

        return this.$set(c, 0, newCoord[0]);
      })
      
    },
  },

  created() {
    this.board = this.build();
    this.tetrominos.push(this.selectNextTetromino());

    window.addEventListener("keydown", (e) => {
      if (e.key === "w") {
        this.currentTetromino.coords = this.currentTetromino.rotate();
      } else if (e.key === "a") {
        this.currentTetromino.coords = this.currentTetromino.move("left");
      } else if (e.key === "d") {
        this.currentTetromino.coords = this.currentTetromino.move("right");
      } else if (e.key === "s") {
        this.currentTetromino.coords = this.currentTetromino.move("down");
      }

      e.preventDefault();
    });
  },
});
