import {Point} from "./point.model";

export class Route {
  routeId: number;
  name: string;
  color: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  visible: boolean;
  points: Point[]=[];

  //should be a json object
  constructor(obj: any) {
    this.routeId = obj.routeId;
    this.name = obj.name;
    this.color = obj.color;
    this.primaryTextColor = obj.primaryTextColor;
    this.secondaryTextColor = obj.secondaryTextColor;
    this.visible = obj.visible;
    for( let tuple of obj.points){
      this.points.push(new Point(tuple))
    }
  }

  /*constructor(routeId: number, name: string, color: string, primaryTextColor: string, secondaryTextColor: string, visible: boolean, points: Point[]) {
    this.routeId = routeId;
    this.name = name;
    this.color = color;
    this.primaryTextColor = primaryTextColor;
    this.secondaryTextColor = secondaryTextColor;
    this.visible = visible;
    this.points = points;
  }*/
}
