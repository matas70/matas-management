export class MatasMetadata {
  private _startDate: string;
  private _plannedStartTime: string;
  private _actualStartTime: string;
  private _plannedEndTime: string;

  constructor(startTime?: string, plannedStartTime?: string, actualStartTime?: string, plannedEndTime?: string) {
    this._startDate = startTime;
    this._plannedStartTime = plannedStartTime;
    this._actualStartTime = actualStartTime;
    this._plannedEndTime = plannedEndTime;
  }

  setJson(obj: any) {
    this._startDate = obj.startDate;
    this._plannedStartTime = obj.plannedStartTime;
    this._actualStartTime = obj.actualStartTime;
    this._plannedEndTime = obj.plannedEndTime;

    return this;
  }


  get startDate(): string {
    return this._startDate;
  }

  set startDate(value: string) {
    this._startDate = value;
  }

  get plannedStartTime(): string {
    return this._plannedStartTime;
  }

  set plannedStartTime(value: string) {
    this._plannedStartTime = value;
  }

  get actualStartTime(): string {
    return this._actualStartTime;
  }

  set actualStartTime(value: string) {
    this._actualStartTime = value;
  }

  get plannedEndTime(): string {
    return this._plannedEndTime;
  }

  set plannedEndTime(value: string) {
    this._plannedEndTime = value;
  }
}
