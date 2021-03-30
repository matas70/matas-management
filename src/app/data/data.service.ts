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


const AIRCRAFTS_INFO = 'https://matasstorage.blob.core.windows.net/matas-dev/aircrafts-info.json';
const AIRCRAFTS = 'https://matasstorage.blob.core.windows.net/matas-dev/aircrafts.json';
const CATEGORIES = 'https://matasstorage.blob.core.windows.net/matas-dev/categories.json';
const ROUTES = 'https://matasstorage.blob.core.windows.net/matas-dev/routes.json';
const POINTS = 'https://matasstorage.blob.core.windows.net/matas-dev/points.json';

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

    const obs1 = this.http.get(AIRCRAFTS_INFO + `?_v=${Date.now()}`);
    const obs2 = this.http.get(AIRCRAFTS + `?_v=${Date.now()}`);
    const obs3 = this.http.get(CATEGORIES + `?_v=${Date.now()}`);
    const obs4 = this.http.get(ROUTES + `?_v=${Date.now()}`);
    const obs5 = this.http.get(POINTS + `?_v=${Date.now()}`);
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
      '?sp=racwl&st=2020-04-02T17:33:35Z&se=2020-06-03T17:33:00Z&sv=2019-02-02&sr=b&sig=vWdGAtxpdxje3FerSv7Wk1mwZJirTzx83zgPEylkyn4%3D');
    this.uploadSingleData('points.json', JSON.stringify(this.currentPoints),
      '?sp=racwl&st=2020-04-02T17:34:14Z&se=2020-06-03T17:34:00Z&sv=2019-02-02&sr=b&sig=LlmmzW0nvLOgpfIVYPZmYoCEJ4A2HjxnYJdwiBeka7I%3D');
    this.uploadSingleData('aircrafts-info.json', JSON.stringify(this.currentTypes),
      '?sp=racwl&st=2020-04-02T17:32:49Z&se=2020-06-03T17:32:00Z&sv=2019-02-02&sr=b&sig=7R4rN%2B0VgqpK1OUPDRblxcAQ4er%2BHzulz5IicR7Qa0E%3D');
  }

  public saveRoutes() {
    this.uploadSingleData('routes.json', JSON.stringify(this.routes),
      '?sp=racwl&st=2020-04-02T17:34:41Z&se=2020-06-03T17:34:00Z&sv=2019-02-02&sr=b&sig=dKX1I5WZpjE%2FtCS6bySjJ0WlugQrXNN16uq6t0043Rg%3D')
  }

  public uploadData() {
    // this.uploadSingleData('aircrafts.json',JSON.stringify(this.aircrafts));
    // this.uploadSingleData('aircrafts-info.json',JSON.stringify(this.aircraftsTypes));
    // this.uploadSingleData('routes.json',JSON.stringify(this.routes));

  }

  public uploadSingleData(name: string, content: string, sas: string) {
    const sasToken = sas;
    const url = 'https://matasstorage.blob.core.windows.net/matas-dev/' + name + '?sp=rwl&st=2021-03-30T10:34:00Z&se=2022-12-30T12:34:00Z&sv=2020-02-10&sr=c&sig=da8KeVAmqo%2BNOfS8sHOm5MecDsSluGi7kZcmIKKYHec%3D';
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
