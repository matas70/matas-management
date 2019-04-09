import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import { Point } from '../../models/point.model';
import { AddUpdatePoint } from 'src/app/reducers/points.actions';
import { pointsReducer } from 'src/app/reducers/points.reducer';

@Component({
  selector: 'app-data-forms-point',
  templateUrl: './data-forms-point.html'
})
export class DataFormsPointComponent implements OnInit {

    onOkClick() {
      this.store.dispatch(new AddUpdatePoint({point: this.pointData}));

      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    setNextPointID(): void {
      let pointsArray: any[];
      this.store.select("points").subscribe(points => {
        pointsArray = Array.from(points.keys());
      });

      this.pointData.pointId =
        pointsArray.reduce(function(a, b) {
          return Math.max(a, b);
      }) + 1;
    }

    constructor(public dialogRef: MatDialogRef<DataFormsPointComponent>,
                @Inject(MAT_DIALOG_DATA) public pointData: Point,
                public store: Store<any>) {
     }

    ngOnInit() {
        if (this.pointData.pointName == undefined) {
          this.pointData = new Point();
          this.setNextPointID();
          this.pointData.E = 0;
          this.pointData.N = 0;
          this.pointData.pointName = "---";
          this.pointData.pointLocation = "---";
          this.pointData.wazeLink = "---";
          this.pointData.activeTimes = "---";
          this.pointData.hidden = false;
          this.pointData.hideAircrafts = false;
        }
    }

}
