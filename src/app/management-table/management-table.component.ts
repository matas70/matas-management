import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {Store} from '@ngrx/store';
import {combineLatest, forkJoin, Observable, Subject} from 'rxjs';
import {Aircraft} from '../models/aircraft.model';
import {Point} from '../models/point.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'
import iziToast from 'izitoast';
import {AddUpdateAircraft, DeleteAircraft} from '../reducers/aircraft.actions';
import {AircraftType} from '../models/aircraft-type.model';
import {DataFormsPointComponent} from '../data-forms/data-forms-point/data-forms-point.component';
import {ActionType} from '../reducers/action-types.enum';
import {DeletePoint} from '../reducers/points.actions';
import {DataFormsAircraftComponent} from '../data-forms/data-forms-aircraft/data-forms-aircraft.component';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import { DataFormsTimeOffsetComponent } from '../data-forms/time-offset/data-forms-offset.component';
import { Route } from '../models/route.model';
import { AddUpdateRoute } from '../reducers/routes.actions';

@Component({
  selector: 'app-management-table',
  templateUrl: './management-table.component.html',
  styleUrls: ['./management-table.component.less']
})
export class ManagementTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private timeRegexp: RegExp = new RegExp('(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)');
  public table = new MatTableDataSource();
  private _tableModel: { point: Point, aircrafts: { aircraft: Aircraft, time: string }[] }[] = [];
  private aircraft: Map<number, Aircraft>;
  private points: Map<number, Point>;
  private routes: Map<number, Route>;
  public aircraftArray: Aircraft[];
  public aircraftTypes: Map<number, AircraftType>;
  public displayedColumns: any[] = [
    'name',
    'actions',
    'N',
    'E'
  ]
  public updatedAcs: { point: Point, aircraft: Aircraft}[] = [];

  @Input()
  savePerformed: Subject<any>;

  public categs: any[];

  constructor(private store: Store<any>, private dialog: MatDialog, private changeRef: ChangeDetectorRef, private data: DataService) {
    let aircraftObservable = this.store.select('aircraft');
    let pointsObservable = this.store.select('points');
    let routesObservable = this.store.select('routes');
    data.cats.subscribe((cats) => {
      this.categs = cats.filter(cat => cat.special);
    });
    combineLatest(aircraftObservable, pointsObservable, routesObservable).subscribe((data: any[]) => {
      this.aircraft = data[0];
      this.points = data[1];
      this.routes = data[2];
      
      this.initTable()
    });

    store.select('aircraftTypes').subscribe((types: Map<number, AircraftType>) => {
      this.aircraftTypes = types;
    });
  }

  initTable() {
    this._tableModel = [];
    Array.from(this.points.values()).forEach((point) => {
      let matchingAircrafts = Array.from(this.aircraft.values()).filter(
        (ac: Aircraft) => {
          return ac.path.find((pointInPath) => pointInPath.pointId === point.pointId) !== undefined;
        }).map((foundAc) => {
        return {aircraft: foundAc, time: foundAc.path.find((pointInPath) => pointInPath.pointId === point.pointId).time}
      });

      let currModel = {
        point: point,
        aircrafts: matchingAircrafts
      }

      this._tableModel.push(currModel);
    });

    Array.from(this.aircraft.values()).forEach((ac) => {
      if (!this.displayedColumns.includes('time-' + ac.aircraftId)) {
        this.displayedColumns.push('time-' + ac.aircraftId);
      }
    });

    this.aircraftArray = Array.from(this.aircraft.values());
    setTimeout(() => {
      this.table.data = this._tableModel;
    }, 100);

    // this.changeRef.detectChanges();
  }

  editPoint(point: { point: Point, aircrafts: { aircraft: Aircraft, time: string }[] }) {
    
    this.dialog.open(DataFormsPointComponent, {
      width: '300px',
      data: {...point.point}
    });
  }

  deletePoint(point: {point: Point, aircrafts: {aircraft: Aircraft, time:String}[]}) {
 
    for (let i of this.routes) {
      const pointIndex = i[1].points.map(point => point.pointId).indexOf(point.point.pointId);
      if (pointIndex != -1) i[1].points.splice(pointIndex, 1);
      this.store.dispatch(new AddUpdateRoute({route: i[1]}));
    }
    
    this.store.dispatch(new DeletePoint({point: point.point}));
    
  }

  editAircraft(ac: Aircraft) {
    this.dialog.open(DataFormsAircraftComponent, {
      width: '300px',
      data: {...ac}
    });
  }

  deleteAircraft(ac: Aircraft) {
    this.displayedColumns.splice(this.displayedColumns.findIndex((col) => col === 'time-' + ac.aircraftId));
    this.store.dispatch(new DeleteAircraft({aircraft: ac}));
  }

  offsetAircraftTime(ac: Aircraft) {
    this.dialog.open(DataFormsTimeOffsetComponent, {
      width: '300px',
      data: {...ac}
    });
  }

  getTimeOfAircraftOnPoint(aircraft: Aircraft, point: Point) {
    // let loc = this.points.get(point.pointId);
    // let foundAircraftFromLoc = this._tableModel.
    // return foundAircraftFromLoc ? foundAircraftFromLoc.time : '';

    // let foundAc = this.table.data.find(model => model.point.pointId === point.pointId).aircrafts
    //   .find((ac) => ac.aircraft.aircraftId === aircraft.aircraftId);
    let foundAc = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);

    return foundAc ? foundAc.time : '--';
  }

  getFromOfAircraftOnPoint(aircraft: Aircraft, point: Point) {
    // let loc = this.points.get(point.pointId);
    // let foundAircraftFromLoc = this._tableModel.
    // return foundAircraftFromLoc ? foundAircraftFromLoc.time : '';

    // let foundAc = this.table.data.find(model => model.point.pointId === point.pointId).aircrafts
    //   .find((ac) => ac.aircraft.aircraftId === aircraft.aircraftId);
    let foundAc = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);

    return foundAc ? (foundAc.from ? foundAc.from : '--') : '--';
  }

  addColumn() {
    // Do we need this?
    // this.aircrafts.push({id: this.aircrafts.length + 1, name: 'מטוס חדש'});
    // let addColumn: string = this.displayedColumns.pop();
    // this.displayedColumns.push('time-' + this.aircrafts.length);
    // this.displayedColumns.push(addColumn);
  }

  aircraftTimeOnPointChanged(aircraft: Aircraft, point: Point, newTime: string) {
    if (newTime === '') {
      let pointIndex = aircraft.path.map((p) => p.pointId).indexOf(point.pointId);
      aircraft.path.splice(pointIndex, 1);
      this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
      this.updatedAcs.push({point: point, aircraft: aircraft});
    } else if (this.timeRegexp.test(newTime)) {
      let foundTime = aircraft.path.find((pathPoint) => pathPoint.pointId === point.pointId);
      if (foundTime) {
        if (foundTime.time !== newTime) {
          foundTime.time = newTime;
          this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
          this.updatedAcs.push({point: point, aircraft: aircraft});
          // iziToast.success({
          //   message: 'הזמן עודכן בהצלחה!'
          // });
        }
      } else {
        aircraft.path.push({pointId: point.pointId, time: newTime});
        this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
        this.updatedAcs.push({point: point, aircraft: aircraft});
        // iziToast.success({
        //   message: 'הזמן עודכן בהצלחה!'
        // });
      }
    } else {

    }
  }

  aircraftFromOnPointChanged(aircraft: Aircraft, point: Point, newTime: string) {
    if (newTime === '') {
      let pointIndex = aircraft.path.map((p) => p.pointId).indexOf(point.pointId);
      aircraft.path.splice(pointIndex, 1);
      this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
      this.updatedAcs.push({point: point, aircraft: aircraft});
    } else if (this.timeRegexp.test(newTime)) {
      let foundTime = aircraft.path.find((pathPoint) => pathPoint.pointId === point.pointId);
      if (foundTime) {
        if (foundTime.from !== newTime) {
          foundTime.from = newTime;
          this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
          this.updatedAcs.push({point: point, aircraft: aircraft});
          // iziToast.success({
          //   message: 'הזמן עודכן בהצלחה!'
          // });
        }
      }
    } else {

    }
  }

  getDateOfAircraftOnPoint(aircraft, point) {
    let foundPathPoint = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);
    return new Date(foundPathPoint.date);
  }

  aircraftDateChanged(date: any, aircraft: Aircraft, point: Point) {
    let foundPathPoint = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);
    foundPathPoint.date = date.value.getFullYear() + '-' + (date.value.getMonth() + 1) + '-' + date.value.getDate();
    this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
    this.updatedAcs.push({point: point, aircraft: aircraft});
  }

  getAircraftPointSpecial(aircraft: Aircraft, point: Point) {
    let foundAc = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);

    return foundAc ? foundAc.special : '';
  }

  specialChanged(event, aircraft: Aircraft, point: Point) {
    let foundAc = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);
    foundAc.special = event;
    foundAc.from = undefined;
    this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
    this.updatedAcs.push({point: point, aircraft: aircraft});
  }

  isAircraftPointUpdated(ac: Aircraft, point: Point) {
    return this.updatedAcs.find((obj) => obj.point.pointId === point.pointId &&
                                ac.aircraftId === obj.aircraft.aircraftId);
  }

  labelClicked(lbl) {
    if (lbl.innerText == '--') {
      lbl.innerText = '';
    }
  }

  labelKeyDown(event: KeyboardEvent, aircraft: Aircraft, point: Point) {
    if (event.key === 'Enter') {
      let currentTarget: any = event.currentTarget;
      if (!this.timeRegexp.test(currentTarget.innerText)) {
        currentTarget.blur();
      } else {
        event.preventDefault();
        currentTarget.blur();
      }
    }
  }

  labelBlurred(lbl, aircraft: Aircraft, point: Point, isFrom: boolean = false) {
    if (!this.timeRegexp.test(lbl.innerText) && lbl.innerText != '') {
      if (!isFrom )
        lbl.innerText = this.getTimeOfAircraftOnPoint(aircraft, point);
      else
        lbl.innerText = this.getFromOfAircraftOnPoint(aircraft, point);
      iziToast.error({
        title: 'שגיאה',
        message: 'אנא הזן זמן בפורמט HH:MM:SS',
        backgroundColor: '#FF502E'
      });
    } else if (lbl.innerText === '') {
      lbl.innerText = '--';
    }
  }

  ngOnInit() {
    this.table.sortingDataAccessor = (item: { point: Point, aircrafts }, property) => {
      if (property === 'name')
        return item.point.pointName;
      else if (property === 'N')
        return item.point.N;
      else if (property === 'E')
        return item.point.E;
      else if (property.startsWith('time'))
        return this.getTimeByColumnNameAndPoint(property, item);
    };
    this.table.sort = this.sort;
  }

  getTimeByColumnNameAndPoint(columnName: string, item: { point: Point, aircrafts: { aircraft: Aircraft, time: string }[] }) {
    let acId = columnName.split('-')[1];
    let obj = item.aircrafts.find((ac) => Number(acId) === ac.aircraft.aircraftId);
    return obj ? obj.time : '';
  }

  trackByIndex(i) {
    return i;
  }

  getAircraftTypeName(ac: Aircraft) {
    return this.aircraftTypes.get(ac.aircraftTypeId).name;
  }

  ngAfterViewInit(): void {
    this.savePerformed.subscribe(() => {
      this.updatedAcs = [];
    });
  }
}
