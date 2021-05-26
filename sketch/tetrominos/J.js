import { Tetromino } from "./Tetromino.js";

const name = "J";
const origin = [1, 3];
const orientations = [
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
];

export class J extends Tetromino {
  constructor() {
    super(name, origin, orientations);
  }
}
