import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule } from '@angular/material';

import { DataFormsComponent } from './data-forms.component';
import { DataFormsAircraftComponent } from './data-forms-aircraft/data-forms-aircraft.component';
import { DataFormsAircraftTypeComponent } from './data-forms-aircrafttype/data-forms-aircrafttype.component';
import { DataFormsPointComponent } from './data-forms-point/data-forms-point.component';
import { DataFormsMetadataComponent } from './data-forms-metadata/data-forms-metadada.component';
import { DataFormsNotificationComponent } from './data-forms-notification/data-forms-notification.component';

@NgModule({
  declarations: [
    DataFormsComponent,
    DataFormsAircraftComponent,
    DataFormsAircraftTypeComponent,
    DataFormsPointComponent,
    DataFormsMetadataComponent,
    DataFormsNotificationComponent
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
    DataFormsPointComponent,
    DataFormsMetadataComponent,
    DataFormsNotificationComponent
  ]
})
export class DataFormsModule { }
