export class Aircraft {
  aircraftId: number;
  aircraftTypeId: number;
  path: {pointId: number, time: string, special?: string, date?: string}[] = [];
  special?: string;

  //should be a json obj
  setJson(obj:any){
    this.aircraftId = obj.aircraftId;
    this.aircraftTypeId = obj.aircraftTypeId;
    this.pathParser(obj.path);
    this.special = obj.special;

    return this;
  }

  constructor(aircraftId?: number, aircraftTypeId?: number, path?: { pointId: number; time: string }[]) {
    this.aircraftId = aircraftId;
    this.aircraftTypeId = aircraftTypeId;
    if (path) {
      this.path = path;
    }
  }

  pathParser(path: any)
  {
    for(let tuple of path) {
      //fix
      if (this.path) {
        this.path.push({pointId: tuple.pointId, time: tuple.time, date: tuple.date, special: tuple.special});
      }
    }
  }


}

export class TableAircraft extends Aircraft {
  time: string;
}
