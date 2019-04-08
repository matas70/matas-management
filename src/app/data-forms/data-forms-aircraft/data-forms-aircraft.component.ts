import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

import { Aircraft } from '../../models/aircraft.model';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

    aircraftInput: Aircraft;

    onNoClick(): void {
        this.dialogRef.close();
      }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>) { }

    ngOnInit() {
    }

}
