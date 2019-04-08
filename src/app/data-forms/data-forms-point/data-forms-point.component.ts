import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

import { Point } from '../../models/point.model';

@Component({
  selector: 'app-data-forms-point',
  templateUrl: './data-forms-point.html'
})
export class DataFormsPointComponent implements OnInit {

    pointInput: Point;

    onNoClick(): void {
        this.dialogRef.close();
      }

    constructor(public dialogRef: MatDialogRef<DataFormsPointComponent>) {
     }

    ngOnInit() {
        this.pointInput = new Point();
        this.pointInput.pointId = 0;
        this.pointInput.E = 0;
        this.pointInput.N = 0;
        this.pointInput.pointName = "---";
        this.pointInput.hidden = true;
        this.pointInput.hideAircrafts = true;
    }

}
