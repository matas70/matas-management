export class Aircraft {
  aircraftId: number;
  aircraftTypeId: number;
  path: {pointId: number, time: string}[];

  constructor(aircraftId: number, aircraftTypeId: number, path: { pointId: number; time: string }[]) {
    this.aircraftId = aircraftId;
    this.aircraftTypeId = aircraftTypeId;
    this.path = path;
  }
}
