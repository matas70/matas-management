import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import { Aircraft } from '../../models/aircraft.model';
import { AircraftType } from '../../models/aircraft-type.model';
import { AddUpdateAircraft, SetAircraft } from 'src/app/reducers/aircraft.actions';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

    aircraftTypeInput: AircraftType;
    aircraftTypes: any[];
    aircraftTypesSorted: any[];
    newValue: boolean;

    onNoClick(): void {
        this.dialogRef.close();
      }

    setAircraftTypeInput(name: any) {
      this.aircraftTypeInput.name = name;
    }

    onOkClick():void {
      let aircraftIDs: number[];
      let lastId: number;

      if (this.newValue) {
        this.store.select("aircraft").subscribe(aircraft => {
          aircraftIDs = Array.from(aircraft.keys());
          lastId = aircraftIDs[aircraftIDs.length - 1];
        })

        this.aircraftData.aircraftId = lastId + 1;
        this.aircraftData.path = [];
      }

      for (let i = 0; i < this.aircraftTypes.length; i++) {
        if (this.aircraftTypes[i].name == this.aircraftTypeInput.name) {
          this.aircraftData.aircraftTypeId = i + 1;
        }
      }

      this.store.dispatch(new AddUpdateAircraft({aircraft: this.aircraftData}));

      this.dialogRef.close();
    }

    constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>,
                @Inject(MAT_DIALOG_DATA) public aircraftData: Aircraft,
                public store: Store<any>, private dataService: DataService) {
                this.aircraftTypes = dataService.getAircraftTypes();
                this.aircraftTypesSorted = 
                  dataService.getAircraftTypes().sort(function(type1, type2){
                  if(type1.name < type2.name) { return -1; }
                  if(type1.name > type2.name) { return 1; }
                  return 0;
                });

                this.aircraftTypeInput = new AircraftType();

                this.newValue = (aircraftData.aircraftTypeId == 0);
     }

    ngOnInit() {
    }

}
