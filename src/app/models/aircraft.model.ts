import {Point} from "./point.model";

export class Aircraft {
  aircraftId: number;
  aircraftTypeId: number;
  path: {pointId: number, time: string}[]=[];

  //should be a json obj
  constructor(obj:any){
    this.aircraftId = obj.aircraftId;
    this.aircraftTypeId = obj.aircraftTypeId;
    this.pathParser(obj.path);
  }

  pathParser(path: any)
  {
    for(let tuple of path)
      //fix
      this.path.push({pointId:tuple.pointId,time:tuple.time});
  }


}

export class TableAircraft extends Aircraft {
  time: string;
}
