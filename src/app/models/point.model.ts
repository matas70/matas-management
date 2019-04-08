import {Aircraft, TableAircraft} from "./aircraft.model";

export class Point {
  pointId: number;
  E: number;
  N: number;
  pointName: string;
  hidden: boolean = false;
  hideAircrafts: boolean = false;

  setJson(obj: any) {
    this.pointId = obj.pointId;
    this.E = obj.E;
    this.N = obj.N;
    this.pointName = obj.pointName;
    this.hidden = obj.hidden;
    this.hideAircrafts = obj.hideAircrafts;

    return this;
  }

  constructor(pointId?: number, E?: number, N?: number, pointName?: string, hidden?: boolean, hideAircrafts?: boolean) {
    this.pointId = pointId;
    this.E = E;
    this.N = N;
    this.pointName = pointName;
    this.hidden = hidden;
    this.hideAircrafts = hideAircrafts;
  }

  /* constructor(pointId: number, E: number, N: number, pointName: string, hidden?: boolean, hideAircrafts?: boolean) {
     this.pointId = pointId;
     this.E = E;
     this.N = N;
     this.pointName = pointName;
     this.hidden = hidden;
     this.hideAircrafts = hideAircrafts;
   }*/
}

export class TablePoint extends Point {
  aircrafts: TableAircraft[];

}
