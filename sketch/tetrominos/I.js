import { Tetromino } from "./Tetromino.js";

const name = "I";
const origin = [1, 3];
const orientations = [
  [
    ["", "", "", ""],
    ["I", "I", "I", "I"],
    ["", "", "", ""],
    ["", "", "", ""]
  ],
  [
    ["", "", "I", ""],
    ["", "", "I", ""],
    ["", "", "I", ""],
    ["", "", "I", ""]
  ],
  [
    ["", "", "", ""],
    ["", "", "", ""],
    ["I", "I", "I", "I"],
    ["", "", "", ""]
  ],
  [
    ["", "I", "", ""],
    ["", "I", "", ""],
    ["", "I", "", ""],
    ["", "I", "", ""]
  ],
];

export class I extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}
