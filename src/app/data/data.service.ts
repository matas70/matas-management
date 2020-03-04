import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, from, Observable, Subject} from 'rxjs';
import {AircraftType} from '../models/aircraft-type.model';
import {Point} from '../models/point.model';
import {Route} from '../models/route.model';
import {Aircraft} from '../models/aircraft.model';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AddAircraftType, SetAircraftTypes} from '../reducers/aircraft-type.actions';
import {AddUpdateAircraft, SetAircraft} from '../reducers/aircraft.actions';
// import {AddPoint} from '../reducers/points.actions';
import {ActionType} from '../reducers/action-types.enum';
import {AddUpdatePoint, SetPoints} from '../reducers/points.actions';
import {MatasMetadata} from '../models/matas-metadata.model';
import {AddUpdateMatasMetadata} from '../reducers/matas-metadata.actions';
import {map} from 'rxjs/operators';
import {SetRoutes} from "../reducers/routes.actions";


const AIRCRAFTS_INFO = 'https://matasstorage.blob.core.windows.net/matas/aircrafts-info.json';
const AIRCRAFTS = 'https://matasstorage.blob.core.windows.net/matas/aircrafts.json';
const CATEGORIES = 'https://matasstorage.blob.core.windows.net/matas/categories.json';
const ROUTES = 'https://matasstorage.blob.core.windows.net/matas/routes.json';
const POINTS = 'https://matasstorage.blob.core.windows.net/matas/points.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public aircrafts: Aircraft[] = [];
  public aircraftsTypes: AircraftType[] = [];
  public points: Point[] = [];
  public routes: {routes: Route[]};
  public cats: Subject<{ category: string, special?: boolean }[]> = new BehaviorSubject([]);

  private currentAircrafts: Aircraft[];
  private currentPoints: Point[];
  private currentTypes: { aircraftTypes: AircraftType[] };
  private currentMeta: MatasMetadata;


  constructor(private http: HttpClient, private store: Store<any>) {
    this.store.select('aircraft').pipe(map((acss: Map<number, Aircraft>) => {
      return Array.from(acss.values()).map((acIn: Aircraft) => {
        if (acIn.special === 'מופעים אווירובטיים' || acIn.special === 'מופעים אוויריים') {
          (acIn as any).aerobatic = true;
        }

        return acIn;
      });
    })).subscribe((acs: any[]) => {
      this.currentAircrafts = acs;
    });
    this.store.select('points').subscribe((points: Map<number, Point>) => this.currentPoints = Array.from(points.values()));
    this.store.select('aircraftTypes').subscribe((types: Map<number, AircraftType>) => this.currentTypes = {aircraftTypes: Array.from(types.values())});
    this.store.select('matasMetadata').subscribe((mets) => this.currentMeta = mets);
    this.store.select('routes').subscribe((routes: Map<number, Route>) => this.routes = {routes: Array.from(routes.values())});
  }


  public loadData() {

    const obs1 = this.http.get(AIRCRAFTS_INFO);
    const obs2 = this.http.get(AIRCRAFTS);
    const obs3 = this.http.get(CATEGORIES);
    const obs4 = this.http.get(ROUTES);
    const obs5 = this.http.get(POINTS);
    forkJoin(obs1, obs2, obs3, obs4, obs5).subscribe((response: any[]) => {
      const aircraftsinfoJSON = response[0].aircraftTypes;
      const aircraftsJSON = response[1];
      // need this?
      const categoriesJSON = response[2];
      this.cats.next(response[2]);
      const routesJSON = response[3].routes;
      const points = response[4];

      const aircraftTypes: Map<number, AircraftType> = new Map();

      if (aircraftsinfoJSON) {
        for (const tuple of aircraftsinfoJSON) {
          aircraftTypes.set(tuple.aircraftTypeId, new AircraftType().setJson(tuple));
        }
      }
      const action = new SetAircraftTypes({aircraftTypes: aircraftTypes});
      this.store.dispatch(action);

      const aircrafts: Map<number, Aircraft> = new Map();
      if (aircraftsJSON && aircraftsJSON.aircrafts) {
        for (const tuple of aircraftsJSON.aircrafts) {
          aircrafts.set(tuple.aircraftId, new Aircraft().setJson(tuple));
        }
      }
      this.store.dispatch(new SetAircraft({aircraft: aircrafts}));

      const routes: Map<number, Route> = new Map<number, Route>();
      for (const tuple of routesJSON) {
        routes.set(tuple.routeId, new Route().setJson(tuple));
      }

      this.store.dispatch(new SetRoutes({routes: routes}));

      const pointsMap: Map<number, Point> = new Map();
      // routes.forEach((route) => {
      //   route.points.forEach((point) => {
      //     pointsMap.set(point.pointId, point);
      //   });
      // });

      if (points) {
        for (const point of points) {
          const newp = new Point().setJson(point);
          pointsMap.set(newp.pointId, newp);
        }
      }

      this.store.dispatch(new SetPoints({points: pointsMap}));

      const metadata = new MatasMetadata().setJson(aircraftsJSON);
      this.store.dispatch(new AddUpdateMatasMetadata({matasMetadata: metadata}));
    });
  }

  public getAircrafts(): Aircraft[] {
    return this.aircrafts;
  }

  public getPoints(): Point[] {
    return this.points;
  }

  public getRoutes(): { routes: Route[] } {
    return this.routes;
  }

  public tempSave() {
    (this.currentMeta as any).aircrafts = this.currentAircrafts;
    this.uploadSingleData('aircrafts.json', JSON.stringify(this.currentMeta),
      '?sp=rw&st=2019-04-16T20:39:22Z&se=2019-05-30T04:39:22Z&spr=https&sv=2018-03-28&sig=t5lNTKtoCZnVUR32fl%2FW516xrS6pBVPxVxKzqkpQ%2BTM%3D&sr=b');
    this.uploadSingleData('points.json', JSON.stringify(this.currentPoints),
      '?sp=rw&st=2019-04-16T20:43:29Z&se=2019-05-30T04:43:29Z&spr=https&sv=2018-03-28&sig=DoW0m70i8qr7rvIogPM22OCCpa8uO%2BNP6hwqyqkbadw%3D&sr=b');
    this.uploadSingleData('aircrafts-info.json', JSON.stringify(this.currentTypes),
      '?sp=racwdl&st=2020-02-26T12:59:56Z&se=2020-02-27T12:59:56Z&sv=2019-02-02&sr=b&sig=UlOcDwI5vDlo0QZlqvTnK7YiU6aRAlxoSqQ4wcSJYT0%3D');
  }

  public saveRoutes() {
    this.uploadSingleData('routes.json', JSON.stringify(this.routes),
      '?sp=racwdl&st=2020-03-04T17:04:59Z&se=2020-06-05T21:04:00Z&sv=2019-02-02&sr=b&sig=iignx59ZI14PWVPssfx1kevvIfOHkcOzSElD4F1QcLY%3D')
  }

  public uploadData() {
    // this.uploadSingleData('aircrafts.json',JSON.stringify(this.aircrafts));
    // this.uploadSingleData('aircrafts-info.json',JSON.stringify(this.aircraftsTypes));
    // this.uploadSingleData('routes.json',JSON.stringify(this.routes));

  }

  public uploadSingleData(name: string, content: string, sas: string) {
    const sasToken = sas;
    const url = 'https://matasstorage.blob.core.windows.net/matas/' + name + sasToken;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'x-ms-blob-type': 'BlockBlob',
        'Content-Length': content.length.toString()
      })
    };
    this.http.put(url, content, httpOptions).subscribe(data => {
      console.log('BIGUS DICKUS');
    });
  }

}
