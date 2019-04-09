import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule } from '@angular/material';

import { DataFormsComponent } from './data-forms.component';
import { DataFormsAircraftComponent } from './data-forms-aircraft/data-forms-aircraft.component';
import { DataFormsAircraftTypeComponent } from './data-forms-aircrafttype/data-forms-aircrafttype.component';
import { DataFormsPointComponent } from './data-forms-point/data-forms-point.component';

@NgModule({
  declarations: [
    DataFormsComponent,
    DataFormsAircraftComponent,
    DataFormsAircraftTypeComponent,
    DataFormsPointComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule
  ],
  entryComponents: [
    DataFormsAircraftComponent,
    DataFormsAircraftTypeComponent,
    DataFormsPointComponent
  ],
  exports: [DataFormsComponent]
})
export class DataFormsModule { }
