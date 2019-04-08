import { Component, OnInit } from '@angular/core';

import { Aircraft } from '../../models/aircraft.model';

@Component({
  selector: 'app-data-forms-aircraft',
  templateUrl: './data-forms-aircraft.html'
})
export class DataFormsAircraftComponent implements OnInit {

    aircraftInput: Aircraft;

    constructor() { }

    ngOnInit() {
    }

}
