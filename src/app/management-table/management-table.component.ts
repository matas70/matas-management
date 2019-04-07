import { Component, OnInit } from '@angular/core';
import {DataService} from "../data/data.service";

@Component({
  selector: 'app-management-table',
  templateUrl: './management-table.component.html',
  styleUrls: ['./management-table.component.less']
})
export class ManagementTableComponent implements OnInit {
  private _tableModel: any;
  private _aircrafts : any[] = [
    {
      id: 1,
      name: "מטוס 1"
    },
    {
      id: 2,
      name: "מטוס 2"
    }
  ];
  private locations: any[] = [
    {
      id: 1,
      name: "מיקום 1",
      coords: "111",
      aircrafts: [
        {
          id: 1,
          time: "12:23"
        },
        {
          id: 2,
          time: "15:10"
        }
      ]
    },
    {
      id: 2,
      name: "מיקום 2",
      coords: "222",
      aircrafts: [
        {
          id: 2,
          time: "17:15"
        }
      ]
    }
  ];

  public displayedColumns: any[] = [
    "name",
    "coords",
    "time-1",
    "time-2",
    "add-aircraft"
  ]


  constructor(private _data: DataService) {
    _data.getData().subscribe((data) => {
      this._tableModel = data;
    })
  }

  get aircrafts(): any[] {
    return this._aircrafts;
  }

  getTimeOfAircraftOnPoint(aircraft: any, location: any) {
    let loc = this.locations.find((currLocation) => currLocation.id === location.id);
    let foundAircraftFromLoc = loc.aircrafts.find((airLoc) => airLoc.id === aircraft.id);
    return foundAircraftFromLoc ? foundAircraftFromLoc.time : "";
  }

  addColumn() {
    this.aircrafts.push({id: this.aircrafts.length + 1, name: "מטוס חדש"});
    let addColumn: string = this.displayedColumns.pop();
    this.displayedColumns.push("time-" + this.aircrafts.length);
    this.displayedColumns.push(addColumn);
  }

  ngOnInit() {
  }

}
