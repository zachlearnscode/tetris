import { Tetromino } from "./Tetromino.js";

const name = "O";
const origin = [1, 3];
const orientations = [
  [
    ["", "O", "O", ""],
    ["", "O", "O", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["", "O", "O", ""],
    ["", "O", "O", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["", "O", "O", ""],
    ["", "O", "O", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["", "O", "O", ""],
    ["", "O", "O", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
];

export class O extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}
