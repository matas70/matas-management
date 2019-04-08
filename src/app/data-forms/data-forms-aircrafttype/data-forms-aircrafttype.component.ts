import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

import { AircraftType } from '../../models/aircraft-type.model';

@Component({
  selector: 'app-data-forms-aircrafttype',
  templateUrl: './data-forms-aircrafttype.html'
})
export class DataFormsAircraftTypeComponent implements OnInit {

    aircraftTypeInput: AircraftType;

    onNoClick(): void {
        this.dialogRef.close();
      }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftTypeComponent>) {
     }

    ngOnInit() {
        this.aircraftTypeInput = new AircraftType();
        this.aircraftTypeInput.aircraftTypeId = 0;
        this.aircraftTypeInput.name = "---";
        this.aircraftTypeInput.category = "---";
        this.aircraftTypeInput.type = "---";
        this.aircraftTypeInput.icon = "---";
        this.aircraftTypeInput.image = "---";
        this.aircraftTypeInput.classification = "---";
        this.aircraftTypeInput.description = "---";
        this.aircraftTypeInput.manufactured = "---";
        this.aircraftTypeInput.dimensions = "---";
        this.aircraftTypeInput.performance = "---";
        this.aircraftTypeInput.weight = "---";
        this.aircraftTypeInput.engine = "---";
    }

}
