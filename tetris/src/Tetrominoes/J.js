import { Tetromino } from "./Tetromino.js";

const name = "J";
const origin = [2, 3];
const orientations = [
  [
    ["J", "", ""],
    ["J", "J", "J"],
    ["", "", ""],
  ],
  [
    ["", "J", "J"],
    ["", "J", ""],
    ["", "J", ""]
  ],
  [
    ["", "", ""],
    ["J", "J", "J"],
    ["", "", "J"],
  ],
  [
    ["", "J", ""],
    ["", "J", ""],
    ["J", "J", ""],
  ],
];

export class J extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}
