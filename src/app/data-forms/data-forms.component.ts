import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';

import { DataFormsAircraftComponent } from './data-forms-aircraft/data-forms-aircraft.component';

@Component({
  selector: 'app-data-forms',
  templateUrl: './data-forms.html'
})
export class DataFormsComponent implements OnInit {


  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DataFormsAircraftComponent, {
      width: '250px'
    });
  }

  ngOnInit() {
  }

}
