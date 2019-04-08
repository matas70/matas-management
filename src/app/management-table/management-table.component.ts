import { Component, OnInit } from '@angular/core';
import {DataService} from "../data/data.service";
import {Store} from "@ngrx/store";
import {combineLatest, forkJoin} from "rxjs";
import {Aircraft} from "../models/aircraft.model";
import {Point} from "../models/point.model";

@Component({
  selector: 'app-management-table',
  templateUrl: './management-table.component.html',
  styleUrls: ['./management-table.component.less']
})
export class ManagementTableComponent implements OnInit {
  private _tableModel: {point: Point, aircrafts: {aircraft: Aircraft, time: string}[]}[] = [];
  private aircraft: Map<number, Aircraft>;
  private points: Map<number, Point>;
  // private _aircrafts : any[] = [
  //   {
  //     id: 1,
  //     name: "מטוס 1"
  //   },
  //   {
  //     id: 2,
  //     name: "מטוס 2"
  //   }
  // ];
  // private points: any[] = [
  //   {
  //     id: 1,
  //     name: "מיקום 1",
  //     coords: "111",
  //     aircrafts: [
  //       {
  //         id: 1,
  //         time: "12:23"
  //       },
  //       {
  //         id: 2,
  //         time: "15:10"
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: "מיקום 2",
  //     coords: "222",
  //     aircrafts: [
  //       {
  //         id: 2,
  //         time: "17:15"
  //       }
  //     ]
  //   }
  // ];

  public displayedColumns: any[] = [
    "name",
    "coords",
    "add-aircraft"
  ]


  constructor(private store: Store<any>) {
    let aircraftObservable = this.store.select("aircraft");
    aircraftObservable.subscribe(data => console.log(data));
    let pointsObservable = this.store.select("points");
    pointsObservable.subscribe(data => console.log(data));

    combineLatest(aircraftObservable, pointsObservable).subscribe((data: any[]) => {
      this.aircraft = data[0];
      this.points = data[1];
      this.initTable()
    });
  }

  initTable() {
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

    let addColumn: string = this.displayedColumns.pop();
    Array.from(this.aircraft.values()).forEach((ac) =>
      this.displayedColumns.push("time-" + ac.aircraftId));
    this.displayedColumns.push(addColumn);
  }

  getTimeOfAircraftOnPoint(aircraft: Aircraft, point: Point) {
    // let loc = this.points.get(point.pointId);
    // let foundAircraftFromLoc = this._tableModel.
    // return foundAircraftFromLoc ? foundAircraftFromLoc.time : "";

    let foundAc = this._tableModel.find(model => model.point.pointId === point.pointId).aircrafts
      .find((ac) => ac.aircraft.aircraftId === aircraft.aircraftId);

    return foundAc ? foundAc.time : "";
  }

  addColumn() {
    this.aircrafts.push({id: this.aircrafts.length + 1, name: "מטוס חדש"});
    let addColumn: string = this.displayedColumns.pop();
    this.displayedColumns.push("time-" + this.aircrafts.length);
    this.displayedColumns.push(addColumn);
  }

  aircraftTimeOnPointChanged(aircraft, location, newTime) {
    console.log(newTime);
  }

  ngOnInit() {
  }

}
