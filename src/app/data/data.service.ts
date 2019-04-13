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
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service';
import {ActionType} from "../reducers/action-types.enum";
import {AddUpdatePoint, SetPoints} from "../reducers/points.actions";
import {MatasMetadata} from "../models/matas-metadata.model";
import {AddUpdateMatasMetadata} from "../reducers/matas-metadata.actions";


const AIRCRAFTS_INFO = "https://matasisrael.blob.core.windows.net/matas/aircrafts-info.json";
const AIRCRAFTS = "https://matasisrael.blob.core.windows.net/matas/aircrafts.json";
const CATEGORIES = "https://matasisrael.blob.core.windows.net/matas/categories.json";
const ROUTES = "https://matasisrael.blob.core.windows.net/matas/routes.json";

const Config: UploadParams = {
  sas: "?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2022-05-09T14:25:14Z&st=2019-04-09T06:25:14Z&spr=https,http&sig=RWFsOZsw%2FsDavG2fS1lDm%2FnBNT1pilRcxk0UMWzNGXk%3D",
  storageAccount: "matasisrael",
  containerName: 'matas'
};
@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts: Aircraft[] = [];
  public aircraftsTypes: AircraftType[] = [];
  public points: Point[] = [];
  public routes: Route[] = [];
  private blob: BlobService;
  private config: UploadConfig;

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
    forkJoin(obs1, obs2, obs3, obs4).subscribe((response: any[]) => {
      let aircraftsinfoJSON = response[0].aircraftTypes;
      let aircraftsJSON = response[1];
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
      for (let tuple of aircraftsJSON.aircrafts) {
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
    this.uploadSingleData("nir.json", JSON.stringify(this.currentMeta))
  }

  public uploadData()
  {
    this.uploadSingleData("aircrafts.json",JSON.stringify(this.aircrafts));
    this.uploadSingleData("aircrafts-info.json",JSON.stringify(this.aircraftsTypes));
    this.uploadSingleData("routes.json",JSON.stringify(this.routes));

  }
  public uploadSingleData(name:string,content:string) {
    let sasToken="?sp=rw&st=2019-04-12T23:40:37Z&se=2019-04-28T07:40:37Z&spr=https&sv=2018-03-28&sig=Bu3Lk7%2BlCcgqRLdjggGQNv%2BqMUn97I82b5k40vyH5lA%3D&sr=b"
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
