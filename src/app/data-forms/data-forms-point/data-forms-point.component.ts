import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';

import { Point } from '../../models/point.model';
import { AddUpdatePoint } from 'src/app/reducers/points.actions';

@Component({
  selector: 'app-data-forms-point',
  templateUrl: './data-forms-point.html'
})
export class DataFormsPointComponent implements OnInit {

    pointInput: Point;

    onOkClick() {
      this.store.dispatch(new AddUpdatePoint({point: this.pointInput}));

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

      this.pointInput.pointId =
        pointsArray.reduce(function(a, b) {
          return Math.max(a, b);
      }) + 1;
    }

    constructor(public dialogRef: MatDialogRef<DataFormsPointComponent>,
                public store: Store<any>) {
     }

    ngOnInit() {
        this.pointInput = new Point();
        this.setNextPointID();
        this.pointInput.E = 0;
        this.pointInput.N = 0;
        this.pointInput.pointName = "---";
        this.pointInput.hidden = true;
        this.pointInput.hideAircrafts = true;
    }

}
