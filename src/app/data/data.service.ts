import {Injectable} from '@angular/core';
import {forkJoin, from, Observable, Subject} from "rxjs";
import {AircraftType} from "../models/aircraft-type.model";
import {Point} from "../models/point.model";
import {Aircraft} from "../models/aircraft.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts: Aircraft[];
  public points: Point[];

  constructor(private http: HttpClient) {
  }

  loadData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let obs = this.http.get("ss");
      let obs2 = this.http.get("ss");

      forkJoin(obs, obs2).subscribe((data : any[]) => {
        let aircrafts = data[0];
        let points = data[1];

        resolve();
      });
    });
  }

  public getAircrafts(): Aircraft[] {
    return this.aircrafts;
  }

  public getPoints(): Point[] {
    return this.points;
  }

  public getAircraftTypes(): Observable<AircraftType[]> {
    return;
  }

  public getPointById(id: number): Point {
    return;
  }

  public getAircraftById(id: number): Aircraft {
    return;
  }
}
