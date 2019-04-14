import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data/data.service";
import {Store} from "@ngrx/store";
import {combineLatest, forkJoin} from "rxjs";
import {Aircraft} from "../models/aircraft.model";
import {Point} from "../models/point.model";
import {MatDialog, MatSort, MatTableDataSource} from "@angular/material";
import iziToast from "izitoast";
import {AddUpdateAircraft, DeleteAircraft} from "../reducers/aircraft.actions";
import {AircraftType} from "../models/aircraft-type.model";
import {RouteGenerationAlgorithmService} from "../route-generation-algorithm/route.generation.algorithm.service";
import {DataFormsPointComponent} from "../data-forms/data-forms-point/data-forms-point.component";
import {DataFormsAircraftComponent} from "../data-forms/data-forms-aircraft/data-forms-aircraft.component";

@Component({
  selector: 'app-management-table',
  templateUrl: './management-table.component.html',
  styleUrls: ['./management-table.component.less']
})
export class ManagementTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  private timeRegexp: RegExp = new RegExp("(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)");
  public table = new MatTableDataSource();
  private _tableModel: { point: Point, aircrafts: { aircraft: Aircraft, time: string }[] }[] = [];
  private aircraft: Map<number, Aircraft>;
  private points: Map<number, Point>;
  public aircraftArray: Aircraft[];
  public aircraftTypes: Map<number, AircraftType>;
  public displayedColumns: any[] = [
    "name",
    "actions",
    "N",
    "E"
  ]
  public updatedAcs: { point: Point, aircraft: Aircraft}[] = [];


  constructor(private store: Store<any>, private al:RouteGenerationAlgorithmService,private dialog: MatDialog, private changeRef: ChangeDetectorRef) {
    let btn = document.getElementById("coolbutton");
    //btn.addEventListener("click", (e:Event) => al.main1());

    let aircraftObservable = this.store.select("aircraft");
    let pointsObservable = this.store.select("points");

    combineLatest(aircraftObservable, pointsObservable).subscribe((data: any[]) => {
      this.aircraft = data[0];
      this.points = data[1];
      this.initTable()
    });

    store.select("aircraftTypes").subscribe((types: Map<number, AircraftType>) => {
      this.aircraftTypes = types;
    });
  }

  private myMethod(event:any):void
  {
    this.al.main1()
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
      if (!this.displayedColumns.includes("time-" + ac.aircraftId)) {
        this.displayedColumns.push("time-" + ac.aircraftId);
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
      width: "300px",
      data: {...point.point}
    });
  }

  deletePoint(point: {point: Point, aircrafts: {aircraft: Aircraft, time:String}[]}) {
    //this.store.dispatch(new DeletePoint({point: point.point}));
  }

  editAircraft(ac: Aircraft) {
    this.dialog.open(DataFormsAircraftComponent, {
      width: "300px",
      data: {...ac}
    });
  }

  deleteAircraft(ac: Aircraft) {
    this.displayedColumns.splice(this.displayedColumns.findIndex((col) => col === "time-" + ac.aircraftId));
    this.store.dispatch(new DeleteAircraft({aircraft: ac}));
  }

  getTimeOfAircraftOnPoint(aircraft: Aircraft, point: Point) {
    // let loc = this.points.get(point.pointId);
    // let foundAircraftFromLoc = this._tableModel.
    // return foundAircraftFromLoc ? foundAircraftFromLoc.time : "";

    // let foundAc = this.table.data.find(model => model.point.pointId === point.pointId).aircrafts
    //   .find((ac) => ac.aircraft.aircraftId === aircraft.aircraftId);
    let foundAc = aircraft.path.find(pathPoint => pathPoint.pointId === point.pointId);

    return foundAc ? foundAc.time : "--";
  }

  addColumn() {
    // Do we need this?
    // this.aircrafts.push({id: this.aircrafts.length + 1, name: "מטוס חדש"});
    // let addColumn: string = this.displayedColumns.pop();
    // this.displayedColumns.push("time-" + this.aircrafts.length);
    // this.displayedColumns.push(addColumn);
  }

  aircraftTimeOnPointChanged(aircraft: Aircraft, point: Point, newTime: string) {
    if (this.timeRegexp.test(newTime)) {
      let foundTime = aircraft.path.find((pathPoint) => pathPoint.pointId === point.pointId);
      if (foundTime) {
        if (foundTime.time !== newTime) {
          foundTime.time = newTime;
          this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
          this.updatedAcs.push({point: point, aircraft: aircraft});
          // iziToast.success({
          //   message: "הזמן עודכן בהצלחה!"
          // });
        }
      } else {
        aircraft.path.push({pointId: point.pointId, time: newTime});
        this.store.dispatch(new AddUpdateAircraft({aircraft: aircraft}));
        this.updatedAcs.push({point: point, aircraft: aircraft});
        // iziToast.success({
        //   message: "הזמן עודכן בהצלחה!"
        // });
      }
    } else {

    }
  }

  isAircraftPointUpdated(ac: Aircraft, point: Point) {
    return this.updatedAcs.find((obj) => obj.point.pointId === point.pointId &&
                                ac.aircraftId === obj.aircraft.aircraftId);
  }

  labelClicked(lbl) {
    if (lbl.innerText == "--") {
      lbl.innerText = "";
    }
  }

  labelKeyDown(event: KeyboardEvent, aircraft: Aircraft, point: Point) {
    if (event.key === "Enter") {
      let currentTarget: any = event.currentTarget;
      if (currentTarget.innerText == "" || !this.timeRegexp.test(currentTarget.innerText)) {
        currentTarget.blur();
      } else {
        event.preventDefault();
        currentTarget.blur();
      }
    }
  }

  labelBlurred(lbl, aircraft: Aircraft, point: Point) {
    if (lbl.innerText == "" || !this.timeRegexp.test(lbl.innerText) ) {
      lbl.innerText = this.getTimeOfAircraftOnPoint(aircraft, point);
      iziToast.error({
        title: "שגיאה",
        message: "אנא הזן זמן בפורמט HH:MM:SS",
        backgroundColor: "#FF502E"
      });
    } else {
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
    let acId = columnName.split("-")[1];
    let obj = item.aircrafts.find((ac) => Number(acId) === ac.aircraft.aircraftId);
    return obj ? obj.time : "";
  }

  trackByIndex(i) {
    return i;
  }

  getAircraftTypeName(ac: Aircraft) {
    return this.aircraftTypes.get(ac.aircraftTypeId).name;
  }
}
