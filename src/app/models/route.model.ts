import {Point} from "./point.model";

export class Route {
  routeId: number;
  name: string;
  color: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  visible: boolean;
  points: Point[];

  constructor(routeId: number, name: string, color: string, primaryTextColor: string, secondaryTextColor: string, visible: boolean, points: Point[]) {
    this.routeId = routeId;
    this.name = name;
    this.color = color;
    this.primaryTextColor = primaryTextColor;
    this.secondaryTextColor = secondaryTextColor;
    this.visible = visible;
    this.points = points;
  }
}
