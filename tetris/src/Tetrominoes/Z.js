import { Tetromino } from "./Tetromino.js";

const name = "Z";
const origin = [2, 3];
const orientations = [
  [
    ["Z", "Z", ""],
    ["", "Z", "Z"],
    ["", "", ""],
  ],
  [
    ["", "", "Z"],
    ["", "Z", "Z"],
    ["", "Z", ""],
  ],
  [
    ["", "", ""],
    ["Z", "Z", ""],
    ["", "Z", "Z"],
  ],
  [
    ["", "Z", ""],
    ["Z", "Z", ""],
    ["Z", "", ""]
  ],
];

export class Z extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}