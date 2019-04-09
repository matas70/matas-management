import { Component } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {DataService} from "./data/data.service";
import {MatDialog} from '@angular/material';

import { DataFormsAircraftComponent } from './data-forms/data-forms-aircraft/data-forms-aircraft.component';
import { DataFormsAircraftTypeComponent } from './data-forms/data-forms-aircrafttype/data-forms-aircrafttype.component';
import { DataFormsPointComponent } from './data-forms/data-forms-point/data-forms-point.component';
import { Aircraft } from './models/aircraft.model';
import { AircraftType } from './models/aircraft-type.model';
import { Point } from './models/point.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'matas-management';

  constructor(private store: Store<any>, data: DataService, public dialog: MatDialog) {
    data.loadData();
    store.select("aircraft").subscribe(aircraft => {
      console.log(aircraft);
    });
  }

  openDialog(dataType: string): void {
    let dialogRefInput;
    let aircraftInput = new AircraftType();
    aircraftInput.setJson({
      "aircraftId": 1,
      "aircraftTypeId" : 1,
      "path": [
        { "pointId": 68, "time": "11:31:09" },
        { "pointId": 37, "time": "11:31:57" },
        { "pointId": 92, "time": "11:33:28" },
        { "pointId": 93, "time": "11:36:41" },
        { "pointId": 148, "time": "11:38:41" },
        { "pointId": 70, "time": "11:39:33" },
        { "pointId": 129, "time": "11:43:19" },
        { "pointId": 7, "time": "11:48:05" },
        { "pointId": 84, "time": "11:54:24" },
        { "pointId": 118, "time": "11:57:49" },
        { "pointId": 14, "time": "11:58:49" },
        { "pointId": 99, "time": "12:01:57" },
        { "pointId": 88, "time": "12:04:25" },
        { "pointId": 133, "time": "12:06:04" },
        { "pointId": 53, "time": "12:09:00" },
        { "pointId": 35, "time": "12:10:53" },
        { "pointId": 162, "time": "12:12:11" },
        { "pointId": 75, "time": "12:12:46" },
        { "pointId": 77, "time": "12:14:00" },
        { "pointId": 105, "time": "12:17:19" },
        { "pointId": 159, "time": "12:19:36" },
        { "pointId": 20, "time": "12:20:40" },
        { "pointId": 74, "time": "12:21:40" },
        { "pointId": 141, "time": "12:22:52" },
        { "pointId": 17, "time": "12:26:46" },
        { "pointId": 30, "time": "12:29:43" },
        { "pointId": 64, "time": "12:33:01" },
        { "pointId": 48, "time": "12:34:19" },
        { "pointId": 125, "time": "12:37:41" },
        { "pointId": 91, "time": "12:42:12" },
        { "pointId": 137, "time": "12:43:40" },
        { "pointId": 45, "time": "12:45:49" },
        { "pointId": 87, "time": "12:47:14" },
        { "pointId": 109, "time": "12:49:40" },
        { "pointId": 27, "time": "12:53:01" },
        { "pointId": 43, "time": "12:55:15" },
        { "pointId": 165, "time": "12:58:16" },
        { "pointId": 66, "time": "12:59:17" },
        { "pointId": 22, "time": "13:00:05" },
        { "pointId": 166, "time": "13:01:06" },
        { "pointId": 102, "time": "13:03:16" },
        { "pointId": 103, "time": "13:04:07" },
        { "pointId": 147, "time": "13:05:20" },
        { "pointId": 73, "time": "13:06:56" },
        { "pointId": 59, "time": "13:07:46" },
        { "pointId": 16, "time": "13:08:26" },
        { "pointId": 12, "time": "13:09:29" },
        { "pointId": 21, "time": "13:10:04" },
        { "pointId": 65, "time": "13:14:45" },
        { "pointId": 101, "time": "13:15:53" },
        { "pointId": 15, "time": "13:16:00" },
        { "pointId": 156, "time": "13:16:00" },
        { "pointId": 86, "time": "13:17:00" }
      ]
    });
    if (dataType == 'aircraft')
          dialogRefInput = this.dialog.open(DataFormsAircraftComponent, {
          width: '250px',
          data: aircraftInput
        });
    else if (dataType == 'aircrafttype')
        dialogRefInput = this.dialog.open(DataFormsAircraftTypeComponent, {
          width: '250px',
          data: new AircraftType()
        });
    else 
        dialogRefInput = this.dialog.open(DataFormsPointComponent, {
          width: '250px',
          data: new Point()
        });
    
    const dialogRef = dialogRefInput;
  }
}
