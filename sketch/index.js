export class Square {
	constructor() {
    this.coords = [[0,4], [0, 5], [1, 5], [1, 4]]
    this.prevCoords = []
  }
  
  move(direction) {
    this.coords.forEach((c, i) => {
    	let [row, col] = c;
    	let [toRow, toCol] = direction;
      
      this.prevCoords[i] = c;
      
      row += toRow;
      col += toCol;
    })
    
    console.log(this.coords)
  }
}

export class TetrisBoard {
	constructor() {
  	this.rows = 20
    this.cols = 10
    this.board = undefined
    this.currentTetromino = new Square()
    this.nextTetromino = undefined
  }
  
  build() {
  	let board = new Array(this.rows).fill()
    	.map(row => row = new Array(this.cols).fill("O"));
    
    return board;
  }
  
  updateBoard() {
  	let ct = this.currentTetromino;
    
    ct.coords.forEach((c, i) => {
    	let [row, col] = c;    
    	this.board[row][col] = "X";
      
      /* if (ct.prevCoords) {
        let [pRow, pCol] = ct.prevCoords[i];
        this.board[pRow][pCol] = "O"; 
      } */
    })
  }
}

let tb = new TetrisBoard();
tb.board = tb.buildBoard()

tb.updateBoard();
tb.currentTetromino.move([1, 0]);
tb.updateBoard();
tb.currentTetromino.move([0, 1]);
tb.updateBoard();


/* const capitalL = [[0,4], [1,4], [2,4], [2,5]];
const skew = [[0,4], [0, 3], [1, 4], [1, 5]];
const line = [[0, 4], [1,4], [2,4], [3,4]];
const tShape = [[0,4], [0,3], [0,5], [1, 4]]; */
