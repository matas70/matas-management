import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';

import { DataFormsAircraftComponent } from './data-forms-aircraft/data-forms-aircraft.component';
import { DataFormsAircraftTypeComponent } from './data-forms-aircrafttype/data-forms-aircrafttype.component';
import { DataFormsPointComponent } from './data-forms-point/data-forms-point.component';

@Component({
  selector: 'app-data-forms',
  templateUrl: './data-forms.html'
})
export class DataFormsComponent implements OnInit {


  constructor(public dialog: MatDialog) { }

  openDialog(dataType: string): void {
    let dialogRefInput;
    if (dataType == 'aircraft')
          dialogRefInput = this.dialog.open(DataFormsAircraftComponent, {
          width: '300px'
        });
    else if (dataType == 'aircrafttype')
        dialogRefInput = this.dialog.open(DataFormsAircraftTypeComponent, {
          width: '300px'
        });
    else 
        dialogRefInput = this.dialog.open(DataFormsPointComponent, {
          width: '300px'
        });
    
    const dialogRef = dialogRefInput;
  }

  ngOnInit() {
  }

}
