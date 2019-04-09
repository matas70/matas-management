import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';

import { Aircraft } from '../../models/aircraft.model';
import { AddAircraft } from 'src/app/reducers/aircraft.actions';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

    aircraftTypeInput: any;
    aircraftTypes: any[];

    onNoClick(): void {
        this.dialogRef.close();
      }

    setAircraftTypeInput(name: any) {
      this.aircraftTypeInput.name = name;
    }

    onOkClick():void {
      let aircraftInput = new Aircraft();
      let aircraftIDs: number[];
      let lastId: number;

      this.store.select("aircraft").subscribe(aircraft => {
        aircraftIDs = Array.from(aircraft.keys());
        lastId = aircraftIDs[aircraftIDs.length - 1];
      })

      aircraftInput.aircraftId = lastId + 1;

      for (let i = 0; i < this.aircraftTypes.length; i++) {
        if (this.aircraftTypes[i] == this.aircraftTypeInput) {
          aircraftInput.aircraftTypeId = i + 1;
        }
      }

      aircraftInput.path = [];

      this.store.dispatch(new AddAircraft({aircraft: aircraftInput}));

      this.dialogRef.close();
    }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>,
                public store: Store<any>, private dataService: DataService) {
                this.aircraftTypes = dataService.getAircraftTypes();
     }

    ngOnInit() {
    }

}
