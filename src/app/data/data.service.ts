import {Injectable} from '@angular/core';
import {forkJoin, from, Observable, Subject} from "rxjs";
import {AircraftType} from "../models/aircraft-type.model";
import {Point} from "../models/point.model";
import {Route} from "../models/route.model";
import {Aircraft} from "../models/aircraft.model";
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {forEach} from "@angular/router/src/utils/collection";
import {Store} from "@ngrx/store";
import {AddAircraftType, SetAircraftTypes} from "../reducers/aircraft-type.actions";
import {AddUpdateAircraft, SetAircraft} from "../reducers/aircraft.actions";
//import {AddPoint} from "../reducers/points.actions";
import {ActionType} from "../reducers/action-types.enum";
import {AddUpdatePoint, SetPoints} from "../reducers/points.actions";
import {MatasMetadata} from "../models/matas-metadata.model";
import {AddUpdateMatasMetadata} from "../reducers/matas-metadata.actions";


const AIRCRAFTS_INFO = "https://matasisrael.blob.core.windows.net/matas/aircrafts-info.json";
const AIRCRAFTS = "https://matasisrael.blob.core.windows.net/matas/aircrafts.json";
const CATEGORIES = "https://matasisrael.blob.core.windows.net/matas/categories.json";
const ROUTES = "https://matasisrael.blob.core.windows.net/matas/routes.json";
const POINTS = "https://matasisrael.blob.core.windows.net/matas/points.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts: Aircraft[] = [];
  public aircraftsTypes: AircraftType[] = [];
  public points: Point[] = [];
  public routes: Route[] = [];

  private currentAircrafts: Aircraft[];
  private currentPoints: Point[];
  private currentTypes: AircraftType[];
  private currentMeta: MatasMetadata;

  constructor(private http: HttpClient, private store: Store<any>) {
    this.store.select("aircraft").subscribe((acs) => this.currentAircrafts = Array.from(acs.values()));
    this.store.select("points").subscribe((points: Map<number, Point>) => this.currentPoints = Array.from(points.values()));
    this.store.select("aircraftTypes").subscribe((types: Map<number, AircraftType>) => this.currentTypes = Array.from(types.values()));
    this.store.select("matasMetadata").subscribe((mets) => this.currentMeta = mets);
  }


  public loadData() {

    let obs1 = this.http.get(AIRCRAFTS_INFO);
    let obs2 = this.http.get(AIRCRAFTS);
    let obs3 = this.http.get(CATEGORIES);
    let obs4 = this.http.get(ROUTES);
    let obs5 = this.http.get(POINTS);
    forkJoin(obs1, obs2, obs3, obs4, obs5).subscribe((response: any[]) => {
      let aircraftsinfoJSON = response[0].aircraftTypes;
      let aircraftsJSON = response[1];
      //need this?
      let categoriesJSON = response[2];
      let routesJSON = response[3].routes;
      let points = response[4];

      let aircraftTypes: Map<number, AircraftType> = new Map();
      for (let tuple of aircraftsinfoJSON) {
        aircraftTypes.set(tuple.aircraftTypeId, new AircraftType().setJson(tuple));
      }
      let action = new SetAircraftTypes({aircraftTypes: aircraftTypes});
      this.store.dispatch(action);

      let aircrafts: Map<number,Aircraft> = new Map();
      for (let tuple of aircraftsJSON.aircrafts) {
        aircrafts.set(tuple.aircraftId, new Aircraft().setJson(tuple));
      }
      this.store.dispatch(new SetAircraft({aircraft: aircrafts}));

      let routes: Route[] = [];
      for (let tuple of routesJSON) {
        routes.push(new Route().setJson(tuple));
      }

      let pointsMap: Map<number, Point> = new Map();
      // routes.forEach((route) => {
      //   route.points.forEach((point) => {
      //     pointsMap.set(point.pointId, point);
      //   });
      // });

      for (let point of points) {
        let newp = new Point().setJson(point);
        pointsMap.set(newp.pointId, newp);
      }

      this.store.dispatch(new SetPoints({points: pointsMap}));

      let metadata = new MatasMetadata().setJson(aircraftsJSON);
      this.store.dispatch(new AddUpdateMatasMetadata({matasMetadata: metadata}));
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

  public tempSave() {
    this.currentMeta["aircrafts"] = this.currentAircrafts;
    this.uploadSingleData("aircrafts.json", JSON.stringify(this.currentMeta),
      "?sp=rw&st=2019-04-16T20:39:22Z&se=2019-05-30T04:39:22Z&spr=https&sv=2018-03-28&sig=t5lNTKtoCZnVUR32fl%2FW516xrS6pBVPxVxKzqkpQ%2BTM%3D&sr=b")
    this.uploadSingleData("points.json", JSON.stringify(this.currentPoints),
      "?sp=rw&st=2019-04-16T20:43:29Z&se=2019-05-30T04:43:29Z&spr=https&sv=2018-03-28&sig=DoW0m70i8qr7rvIogPM22OCCpa8uO%2BNP6hwqyqkbadw%3D&sr=b")
  }

  public uploadData()
  {
    // this.uploadSingleData("aircrafts.json",JSON.stringify(this.aircrafts));
    // this.uploadSingleData("aircrafts-info.json",JSON.stringify(this.aircraftsTypes));
    // this.uploadSingleData("routes.json",JSON.stringify(this.routes));

  }
  public uploadSingleData(name:string,content:string, sas: string) {
    let sasToken= sas;
    let url = "https://matasisrael.blob.core.windows.net/matas/" + name + sasToken;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'x-ms-blob-type': 'BlockBlob',
        'Content-Length': content.length.toString()
      })
    };
    this.http.put(url, content, httpOptions).subscribe(data=> {
      console.log("BIGUS DICKUS")
    });
  }

}
