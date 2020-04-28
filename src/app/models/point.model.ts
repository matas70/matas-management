import {Aircraft, TableAircraft} from './aircraft.model';

export class Point {
  pointId: number;
  E: number;
  N: number;
  pointName: string;
  pointLocation: string;
  wazeLink: string;
  activeTimes: string;
  exhibitions: string;
  hidden: boolean = false;
  hideAircrafts: boolean = false;
  type: string;
  youtubeLink: string;

  setJson(obj: any) {
    this.pointId = obj.pointId;
    this.E = obj.E;
    this.N = obj.N;
    this.pointName = obj.pointName;
    this.hidden = obj.hidden;
    this.hideAircrafts = obj.hideAircrafts;
    this.pointLocation = obj.pointLocation;
    this.wazeLink = obj.wazeLink;
    this.activeTimes = obj.activeTimes;
    this.exhibitions = obj.exhibitions;
    this.type = obj.type;

    return this;
  }

  constructor(pointId?: number, E?: number, N?: number, pointName?: string,
              pointLocation?: string, wazeLink?: string, activeTimes?: string, hidden?: boolean, hideAircrafts?: boolean, exhibitions?: string, type?: string) {
    this.pointId = pointId;
    this.E = E;
    this.N = N;
    this.pointName = pointName;
    this.pointLocation = pointLocation;
    this.wazeLink = wazeLink;
    this.activeTimes = activeTimes;
    this.hidden = hidden;
    this.hideAircrafts = hideAircrafts;
    this.exhibitions = exhibitions;
    this.type = type;
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
