import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';

import { AircraftType } from '../../models/aircraft-type.model';
import { AddAircraftType } from 'src/app/reducers/aircraft-type.actions';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircrafttype',
  templateUrl: './data-forms-aircrafttype.html'
})
export class DataFormsAircraftTypeComponent implements OnInit {

    aircraftTypeInput: AircraftType;

    onOkClick() {
      this.store.dispatch(new AddAircraftType({aircraftType: this.aircraftTypeInput}));

      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
      }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftTypeComponent>,
                public store: Store<any>, private dataService: DataService) {
     }

    ngOnInit() {
        this.aircraftTypeInput = new AircraftType();
        this.aircraftTypeInput.aircraftTypeId = this.dataService.getAircraftTypes().length + 1;
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
