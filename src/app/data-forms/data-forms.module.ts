import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataFormsComponent } from './data-forms.component';
import { DataFormsAircraftComponent } from './data-forms-aircraft/data-forms-aircraft.component'

@NgModule({
  declarations: [
    DataFormsComponent,
    DataFormsAircraftComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [DataFormsComponent]
})
export class DataFormsModule { }
