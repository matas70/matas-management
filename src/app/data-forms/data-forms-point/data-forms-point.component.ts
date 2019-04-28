import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import { Point } from '../../models/point.model';
import { AddUpdatePoint } from 'src/app/reducers/points.actions';

@Component({
  selector: 'app-data-forms-point',
  templateUrl: './data-forms-point.html'
})
export class DataFormsPointComponent implements OnInit {

    private latestId: number = 1;

    constructor(public dialogRef: MatDialogRef<DataFormsPointComponent>,
                @Inject(MAT_DIALOG_DATA) public pointData: Point,
                public store: Store<any>) {
      this.store.select("points").subscribe(points => {
        this.latestId = Array.from(points.keys()).length + 1;
      });
     }

    onOkClick() {
      this.store.dispatch(new AddUpdatePoint({point: this.pointData}));
      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    ngOnInit() {
        if (this.pointData.pointName == undefined) {
          this.pointData = new Point();
          this.pointData.pointId = this.latestId;
          this.pointData.E = 0;
          this.pointData.N = 0;
          this.pointData.pointName = "";
          this.pointData.pointLocation = "";
          this.pointData.wazeLink = "";
          this.pointData.activeTimes = "";
          this.pointData.hidden = false;
          this.pointData.hideAircrafts = false;
          this.pointData.exhibitions = "";
        }
    }

}
