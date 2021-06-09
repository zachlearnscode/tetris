import { Tetromino } from "./Tetromino.js";

const name = "S";
const origin = [2, 3];
const orientations = [
  [
    ["", "S", "S"],
    ["S", "S", ""],
    ["", "", ""],
  ],
  [
    ["", "S", ""],
    ["", "S", "S"],
    ["", "", "S"],
  ],
  [
    ["", "", ""],
    ["", "S", "S"],
    ["S", "S", ""],
  ],
  [
    ["S", "", ""],
    ["S", "S", ""],
    ["", "S", ""]
  ],
];

export class S extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}