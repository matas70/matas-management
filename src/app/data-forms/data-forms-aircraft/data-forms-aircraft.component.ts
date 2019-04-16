import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import {Aircraft} from '../../models/aircraft.model';
import {AircraftType} from '../../models/aircraft-type.model';
import {AddUpdateAircraft, SetAircraft} from 'src/app/reducers/aircraft.actions';
import {DataService} from 'src/app/data/data.service';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

  aircraftTypeInput: AircraftType;
  aircraftTypes: AircraftType[];
  aircrafts: Aircraft[];
  aircraftTypesSorted: any[];
  newValue: boolean;
  currentType: AircraftType;

  constructor(public dialogRef: MatDialogRef<DataFormsAircraftComponent>,
              @Inject(MAT_DIALOG_DATA) public aircraftData: Aircraft,
              public store: Store<any>, private dataService: DataService) {
    // this.aircraftTypes = dataService.getAircraftTypes();

    store.select("aircraftTypes").subscribe((types: Map<number, AircraftType>) => {
      this.aircraftTypes = Array.from(types.values()).sort(function (type1, type2) {
        if (type1.name < type2.name) {
          return -1;
        }
        if (type1.name > type2.name) {
          return 1;
        }
        return 0;
      });
      this.currentType = this.aircraftTypes[0];
    });


    store.select("aircraft").subscribe((aircraft: Map<number, Aircraft>) => {
      this.aircrafts = Array.from(aircraft.values());
    });
    this.aircraftTypeInput = new AircraftType();

    this.newValue = (aircraftData.aircraftTypeId === undefined);
    if (!this.newValue) {
      this.currentType = this.aircraftTypes.find((type) => this.aircraftData.aircraftTypeId === type.aircraftTypeId);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // setAircraftTypeInput(name: any) {
  //   this.aircraftTypeInput.name = name;
  // }

  onOkClick(): void {
    let lastId: number;

    if (this.newValue) {
      let idd = this.aircrafts[this.aircrafts.length - 1];
      lastId = idd ? idd.aircraftId + 1 : 1;
      this.aircraftData.aircraftId = lastId;
      this.aircraftData.path = [];
    }

    // for (let i = 0; i < this.aircraftTypes.length; i++) {
    //   if (this.aircraftTypes[i].name == this.aircraftTypeInput.name) {
    //     this.aircraftData.aircraftTypeId = i + 1;
    //   }
    // }

    this.aircraftData.aircraftTypeId = this.currentType.aircraftTypeId;

    this.store.dispatch(new AddUpdateAircraft({aircraft: this.aircraftData}));
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
