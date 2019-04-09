import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';

import { Aircraft } from '../../models/aircraft.model';
import { AircraftType } from '../../models/aircraft-type.model';
import { AddUpdateAircraft } from 'src/app/reducers/aircraft.actions';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

    aircraftTypeInput: AircraftType;
    aircraftTypes: any[];
    aircraftTypesSorted: any[];

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
        if (this.aircraftTypes[i].name == this.aircraftTypeInput.name) {
          aircraftInput.aircraftTypeId = i + 1;
        }
      }

      aircraftInput.path = [];

      this.store.dispatch(new AddUpdateAircraft({aircraft: aircraftInput}));

      this.dialogRef.close();
    }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>,
                public store: Store<any>, private dataService: DataService) {
                this.aircraftTypes = dataService.getAircraftTypes();
                this.aircraftTypesSorted = 
                  dataService.getAircraftTypes().sort(function(type1, type2){
                  if(type1.name < type2.name) { return -1; }
                  if(type1.name > type2.name) { return 1; }
                  return 0;
                });
                this.aircraftTypeInput = new AircraftType();
     }

    ngOnInit() {
    }

}
