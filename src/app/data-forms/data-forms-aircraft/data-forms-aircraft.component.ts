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

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>) {
     }

    ngOnInit() {
      this.aircraftInput = new Aircraft();
      this.aircraftInput.aircraftId = 0;
      this.aircraftInput.aircraftTypeId = 0;
      this.aircraftInput.path = [];
    }

}
