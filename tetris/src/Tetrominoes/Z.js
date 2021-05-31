import { Tetromino } from "./Tetromino.js";

const name = "Z";
const origin = [1, 3];
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