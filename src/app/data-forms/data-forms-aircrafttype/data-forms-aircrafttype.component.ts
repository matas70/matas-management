import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import { AircraftType } from '../../models/aircraft-type.model';
import { AddAircraftType } from 'src/app/reducers/aircraft-type.actions';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircrafttype',
  templateUrl: './data-forms-aircrafttype.html'
})
export class DataFormsAircraftTypeComponent implements OnInit {

    onOkClick() {
      this.store.dispatch(new AddAircraftType({aircraftType: this.aircraftTypeData}));

      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
      }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftTypeComponent>,
                @Inject(MAT_DIALOG_DATA) public aircraftTypeData: AircraftType,
                public store: Store<any>, private dataService: DataService) {
     }

    ngOnInit() {
      if (this.aircraftTypeData.name == undefined) {
        this.aircraftTypeData = new AircraftType();
        this.aircraftTypeData.aircraftTypeId = this.dataService.getAircraftTypes().length + 1;
        this.aircraftTypeData.name = "---";
        this.aircraftTypeData.category = "---";
        this.aircraftTypeData.type = "---";
        this.aircraftTypeData.icon = "---";
        this.aircraftTypeData.image = "---";
        this.aircraftTypeData.classification = "---";
        this.aircraftTypeData.description = "---";
        this.aircraftTypeData.manufactured = "---";
        this.aircraftTypeData.dimensions = "---";
        this.aircraftTypeData.performance = "---";
        this.aircraftTypeData.weight = "---";
        this.aircraftTypeData.engine = "---";
      }
    }

}
