import {Point} from "./point.model";

export class Aircraft {
  aircraftId: number;
  aircraftTypeId: number;
  path: {pointId: number, time: string}[];

  constructor(json:string){
    let obj = JSON.parse(json);
    this.aircraftId = obj.aircraftId;
    this.aircraftTypeId = obj.aircraftTypeId;
    this.pathParser(obj.path);
  }

  pathParser(path: JSON)
  {
    for(let tuple in path)
      //fix
      null;
     // this.path.push(tuple.pointId,tuple.time);
  }


}

export class TableAircraft extends Aircraft {
  time: string;
}
