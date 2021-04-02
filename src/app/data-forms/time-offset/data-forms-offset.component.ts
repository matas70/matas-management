import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {Aircraft} from '../../models/aircraft.model';
import {AircraftType} from '../../models/aircraft-type.model';
import {DataService} from 'src/app/data/data.service';
import { AddUpdateAircraft } from 'src/app/reducers/aircraft.actions';

@Component({
  selector: 'app-data-forms-offset',
  templateUrl: './data-forms-offset.html'
})
export class DataFormsTimeOffsetComponent implements OnInit {

  aircraftTypeInput: AircraftType;
  aircraftTypes: AircraftType[];
  aircrafts: Aircraft[];
  aircraftTypesSorted: any[];
  newValue: boolean;
  currentType: AircraftType;
  categs: any[];

  constructor(public dialogRef: MatDialogRef<DataFormsTimeOffsetComponent>, @Inject(MAT_DIALOG_DATA) public ac: Aircraft, public store: Store<any>, private dataService: DataService) {

  }

  offset = "0";
  offsetMinutes(e) {
    this.offset = e.target.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    for (let t in this.ac.path) {
      const msWithOffset = Date.parse("05/29/2000 " + this.ac.path[t].time) + parseInt(this.offset)*(60*1000);
      const hrs = new Date(msWithOffset).getHours(),
            min = new Date(msWithOffset).getMinutes(),
            sec = new Date(msWithOffset).getSeconds()
      this.ac.path[t].time = `${("0" + hrs).slice(-2)}:${("0" + min).slice(-2)}:${("0" + sec).slice(-2)}`;
    }

    this.store.dispatch(new AddUpdateAircraft({ aircraft: this.ac }));
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
