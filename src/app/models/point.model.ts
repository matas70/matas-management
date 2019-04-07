export class Point {
  pointId: number;
  E: number;
  N: number;
  pointName: string;
  hidden: boolean = false;
  hideAircrafts: boolean = false;

  constructor(pointId: number, E: number, N: number, pointName: string, hidden?: boolean, hideAircrafts?: boolean) {
    this.pointId = pointId;
    this.E = E;
    this.N = N;
    this.pointName = pointName;
    this.hidden = hidden;
    this.hideAircrafts = hideAircrafts;
  }
}
