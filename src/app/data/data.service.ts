import {Injectable} from '@angular/core';
import {forkJoin, from, Observable, Subject} from "rxjs";
import {AircraftType} from "../models/aircraft-type.model";
import {Point} from "../models/point.model";
import {Route} from "../models/route.model";
import {Aircraft} from "../models/aircraft.model";
import {HttpClient} from "@angular/common/http";
import {forEach} from "@angular/router/src/utils/collection";



const AIRCRAFTS_INFO = "https://matasisrael.blob.core.windows.net/matas/aircrafts-info.json";
const AIRCRAFTS      = "https://matasisrael.blob.core.windows.net/matas/aircrafts.json";
const CATEGORIES     = "https://matasisrael.blob.core.windows.net/matas/categories.json";
const ROUTES         = "https://matasisrael.blob.core.windows.net/matas/routes.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts : Aircraft[] = [];
  public aircraftsTypes:AircraftType[]=[];
  public points: Point[]=[];
  public routes: Route[]=[];

  constructor(private http: HttpClient) {
  }


  public loadData(): Promise<any> {
    return new Promise((resolve, reject) => {

      let obs1 = this.http.get(AIRCRAFTS_INFO);
      let obs2 = this.http.get(AIRCRAFTS);
      let obs3 = this.http.get(CATEGORIES);
      let obs4 = this.http.get(ROUTES);
      forkJoin(obs1, obs2, obs3, obs4).subscribe((response : any[]) => {
        let aircraftsinfoJSON  = response[0].aircraftTypes;
        let aircraftsJSON      = response[1].aircrafts;
        //need this?
        let categoriesJSON     = response[2];
        let routesJSON         = response[3].routes;



        for ( let tuple of aircraftsinfoJSON) {
          this.aircraftsTypes.push(new AircraftType(tuple))
        }

        for (let tuple of aircraftsJSON){
          this.aircrafts.push(new Aircraft(tuple))
        }

        for (let tuple of routesJSON){
          this.routes.push(new Route(tuple))
        }

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
  public getRoutes(): Route[]{
    return this.routes;
  }
}
