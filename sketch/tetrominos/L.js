import { Tetromino } from "./Tetromino.js";

const name = "L";
const origin = [1, 3];
const orientations = [
  [
    ["", "", "L"],
    ["L", "L", "L"],
    ["", "", ""],
  ],
  [
    ["", "L", ""],
    ["", "L", ""],
    ["", "L", "L"]
  ],
  [
    ["", "", ""],
    ["L", "L", "L"],
    ["L", "", ""],
  ],
  [
    ["L", "L", ""],
    ["", "L", ""],
    ["", "L", ""],
  ],
];

export class L extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}