import { Tetromino } from "./Tetromino.js";

const name = "E";
const origin = [0, 0];
const orientations = [
  [
    ["E", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["E", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["E", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["E", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
];

export class Empty extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }

  move() {
    return;
  }
}