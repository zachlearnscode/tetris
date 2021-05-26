import { Tetromino } from "./Tetromino.js";

const name = "T";
const origin = [1, 3];
const orientations = [
  [
    ["", "T", ""],
    ["T", "T", "T"],
    ["", "", ""],
  ],
  [
    ["", "T", ""],
    ["", "T", "T"],
    ["", "T", ""],
  ],
  [
    ["", "", ""],
    ["T", "T", "T"],
    ["", "T", ""],
  ],
  [
    ["", "T", ""],
    ["T", "T", ""],
    ["", "T", ""]
  ],
];

export class T extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}