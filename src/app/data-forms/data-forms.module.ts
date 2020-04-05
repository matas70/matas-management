import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
