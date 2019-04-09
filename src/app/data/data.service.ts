import {Injectable} from '@angular/core';
import {forkJoin, from, Observable, Subject} from "rxjs";
import {AircraftType} from "../models/aircraft-type.model";
import {Point} from "../models/point.model";
import {Route} from "../models/route.model";
import {Aircraft} from "../models/aircraft.model";
import {HttpClient} from "@angular/common/http";
import {forEach} from "@angular/router/src/utils/collection";
import {Store} from "@ngrx/store";
import {AddAircraftType, SetAircraftTypes} from "../reducers/aircraft-type.actions";
import {AddAircraft, SetAircraft} from "../reducers/aircraft.actions";
import {AddPoint, SetPoints} from "../reducers/points.actions";


const AIRCRAFTS_INFO = "https://matasisrael.blob.core.windows.net/matas/aircrafts-info.json";
const AIRCRAFTS = "https://matasisrael.blob.core.windows.net/matas/aircrafts.json";
const CATEGORIES = "https://matasisrael.blob.core.windows.net/matas/categories.json";
const ROUTES = "https://matasisrael.blob.core.windows.net/matas/routes.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts: Aircraft[] = [];
  public aircraftsTypes: AircraftType[] = [];
  public points: Point[] = [];
  public routes: Route[] = [];

  constructor(private http: HttpClient, private store: Store<any>) {

  }


  public loadData() {

    let obs1 = this.http.get(AIRCRAFTS_INFO);
    let obs2 = this.http.get(AIRCRAFTS);
    let obs3 = this.http.get(CATEGORIES);
    let obs4 = this.http.get(ROUTES);
    forkJoin(obs1, obs2, obs3, obs4).subscribe((response: any[]) => {
      let aircraftsinfoJSON = response[0].aircraftTypes;
      let aircraftsJSON = response[1].aircrafts;
      //need this?
      let categoriesJSON = response[2];
      let routesJSON = response[3].routes;

      let aircraftTypes: Map<number, AircraftType> = new Map();
      for (let tuple of aircraftsinfoJSON) {
        aircraftTypes.set(tuple.aircraftTypeId, new AircraftType().setJson(tuple));
      }
      let action = new SetAircraftTypes({aircraftTypes: aircraftTypes});
      this.store.dispatch(action);

      let aircrafts: Map<number,Aircraft> = new Map();
      for (let tuple of aircraftsJSON) {
        aircrafts.set(tuple.aircraftId, new Aircraft().setJson(tuple));
      }
      this.store.dispatch(new SetAircraft({aircraft: aircrafts}));

      let routes: Route[] = [];
      for (let tuple of routesJSON) {
        routes.push(new Route().setJson(tuple));
      }

      let pointsMap: Map<number, Point> = new Map();
      routes.forEach((route) => {
        route.points.forEach((point) => {
          pointsMap.set(point.pointId, point);
        });
      });

      this.store.dispatch(new SetPoints({points: pointsMap}));
    });
  }

  public getAircrafts(): Aircraft[] {
    return this.aircrafts;
  }

  public getPoints(): Point[] {
    return this.points;
  }

  public getRoutes(): Route[] {
    return this.routes;
  }

  public getAircraftTypes() {
    let aircraftTypesArray: any[];
    this.store.select("aircraftTypes").subscribe(aircraftTypes=> {
      aircraftTypesArray = Array.from(aircraftTypes.values());
    });
    return aircraftTypesArray;
  }
}
