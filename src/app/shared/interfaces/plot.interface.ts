export interface Coordinate {
  x: number,
  y: number,
}

export interface Plot extends Coordinate {
  color: string
}

export interface Line{
  start: Coordinate,
  end: Coordinate,
  color: string
}

export const Plots: Plot[] = [
  {x: 0.1, y: 1.2, color: 'red'},
  {x: 0.2, y: 0.85, color: 'green'},
  {x: 0.3, y: 0.44, color: 'green'},
  {x: 0.4, y: 0.13, color: 'blue'},
  {x: 0.5, y: 0.11, color: 'blue'},
  {x: 0.6, y: 1.11, color: 'red'},
  {x: 0.7, y: 1.7, color: 'red'},
  {x: 0.8, y: 1.03, color: 'green'},
  {x: 0.9, y: 0.1, color: 'blue'},
  {x: 1, y: 0.95, color: 'green'},
  {x: 0.15, y: 1.2, color: 'red'},
  {x: 0.25, y: 0.25, color: 'blue'},
  {x: 0.35, y: 1.44, color: 'red'},
  {x: 0.45, y: 0.63, color: 'green'},
  {x: 0.55, y: 0.31, color: 'blue'},
  {x: 0.65, y: 1.41, color: 'red'},
  {x: 0.75, y: 0.7, color: 'green'},
  {x: 0.85, y: 1.43, color: 'red'},
  {x: 0.91, y: 1.01, color: 'green'},
  {x: 0.96, y: 0.934, color: 'green'}
];

export const LocH: Line = {start: {x:0.2, y:1.1}, end: {x:1, y:1.1}, color: "red"};

export const LocU: Line = {start: {x:0.2, y:0.4}, end: {x:1, y:0.4}, color: "blue"};

export const LeftLimit: Line = {start: {x:0.2, y:0}, end: {x:0.2, y:1.7}, color: "gray"};
