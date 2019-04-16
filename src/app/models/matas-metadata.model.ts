export class MatasMetadata {
  public startDate: string;
  public plannedStartTime: string;
  public actualStartTime: string;
  public plannedEndTime: string;

  constructor(startTime?: string, plannedStartTime?: string, actualStartTime?: string, plannedEndTime?: string) {
    this.startDate = startTime;
    this.plannedStartTime = plannedStartTime;
    this.actualStartTime = actualStartTime;
    this.plannedEndTime = plannedEndTime;
  }

  setJson(obj: any) {
    this.startDate = obj.startDate;
    this.plannedStartTime = obj.plannedStartTime;
    this.actualStartTime = obj.actualStartTime;
    this.plannedEndTime = obj.plannedEndTime;

    return this;
  }
}
