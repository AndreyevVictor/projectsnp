import { Coordinate } from "../../interfaces/coordinate.interface";
import { Line } from "../../interfaces/line.interface";
import { Plot } from "../../interfaces/plot.interface";
import { Rect } from "../../interfaces/rectangle.interface";
import { Path } from "../../interfaces/path.interface";

export const CountsData: Plot[] = [
  {x: 30, y: 40, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 50, y: 85, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 410, y: 75, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 250, y: 630, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 135, y: 711, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 270, y: 85, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 300, y: 25, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 250, y: 37, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 39, y: 45, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 38, y: 195, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 15, y: 2, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 250, y: 835, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 300, y: 782, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 28, y: 63, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 55, y: 31, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 65, y: 41, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 475, y: 420, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 85, y: 43, color: 'blue', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 91, y: 701, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}},
  {x: 96, y: 434, color: 'red', tooltipData: {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'}}
];

export const lineData: Path[] = [
  {data: [[100, 350], [200, 300], [350, 450]], color: "green", width: 3},
  {data: [[470, 350], [600, 300], [250, 378]], color: "red", width: 3},
  {data: [[150, 350], [600, 390], [270, 385]], color: "blue", width: 3},
  {data: [[350, 550], [800, 390], [230, 355]], color: "black", width: 1}
];

export const LocU: Line[] = [
  {start: {x:40, y:0}, end: {x:40, y:850}, color: "grey"},
  {start: {x:600, y:0}, end: {x:600, y:850}, color: "grey"},
  {start: {x:75, y:0}, end: {x:75, y:850}, color: "grey"}
];

export const Rectangle: Rect = {height: 450, width: 830}
