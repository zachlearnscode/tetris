export class Tetromino {
  constructor(name, origin, orientations) {
    this.name = name,

    this._origin = origin,
    this._orientations = orientations,
    this._prevCoords = undefined,

    this._hardDropped = false,
    this._onHold = false,

    this._interval = undefined
  }

  get orientation() {
    return this._orientations[0];
  }

  set orientation({dir, board}) {
    let requestedOrientation;

    if (dir === "CW") {
      requestedOrientation = this._orientations
        .slice(1).concat(this._orientations.slice(0, 1));
    } else if (dir === "CCW") {
      requestedOrientation = this._orientations
        .slice(3).concat(this._orientations.slice(0, 3));
    }

    let orientationIsValid = this.simulatePosition(this._origin, requestedOrientation[0], board);

    if (orientationIsValid) {
      this._prevCoords = this.mapToCoords();
      return this._orientations = requestedOrientation;
    }

    return;
  }

  getMaxOrigin(board) {
    let [row, col] = this._origin;
    let orientation = this.orientation;

    row++;
    while (this.simulatePosition([row, col], orientation, board)) {
      row++;
    }

    let maxOrigin = [row - 1, col];

    return maxOrigin
  }

  move(dir, board) {
    let requestedOrigin, moveIsValid = true;

    switch (dir) {
      case "D": {
        dir = [1, 0];
        break;
      }
      case "L": {
        dir = [0, -1];
        break;
      }
      case "R": {
        dir = [0, 1];
        break;
      }
      case "HD": {
        requestedOrigin = this.getMaxOrigin(board);
        break;
      }
      default: {
        dir = [0, 0];
        break;
      }
    }

    if (!requestedOrigin) {
      requestedOrigin = [this._origin[0] + dir[0], this._origin[1] + dir[1]];
      moveIsValid = this.simulatePosition(requestedOrigin, this.orientation, board);
    }    

    if (moveIsValid && !this._hardDropped) {
      if (dir === "HD") {
        this._hardDropped = true;
      }
      this._prevCoords = this.mapToCoords();
      return this._origin = requestedOrigin;
    }

    return;
  }
  
  simulatePosition(origin, orientation, board) {
    // Accept a requested origin or orientation and the current board
    //to simulate a requested position for the tetromino.
    //Ensure that requested position won't move the tetromino out of bounds
    //and won't collide with an already-placed piece.
    //Exclude the tetromino's current  coordinates on the board.

    let result = true;

    let coordsNow = this.mapToCoords().map(c => c.toString());
    let requestedCoords = this.mapToCoords(origin, orientation);

    requestedCoords.forEach(requestedCoord => {
      let [row, col] = requestedCoord;
      if (!coordsNow.includes(requestedCoord.toString())) {
        if (col < 0 || col >= 10 || row >= 22 || board[row][col]) {
          result = false;
        }
      }
    })

    return result;
  }

  mapToCoords(origin = this._origin, orientation = this.orientation) {
    let result = [];

    for (let r = 0; r < orientation.length; r++) {
      let row = origin[0] + r;
      for (let c = 0; c < orientation[r].length; c++) {
        let col = origin[1] + c;
        if (orientation[r][c]) {
          result.push([row, col]);
        }
      }
    }
    
    return result;
  }
}