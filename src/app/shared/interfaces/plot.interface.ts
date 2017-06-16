import { Coordinate } from "./coordinate.interface";

export interface Plot extends Coordinate {
  color: string,
  tooltipData: {}
}