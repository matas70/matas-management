import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataFormsModule} from './data-forms/data-forms.module';
import { AppComponent } from './app.component';
import { ManagementTableComponent } from './management-table/management-table.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {StoreModule} from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import {DataService} from './data/data.service';
import {HttpClientModule} from '@angular/common/http';
import {ContenteditableModel} from './management-table/content-editable.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {AngularFireFunctionsModule, FunctionsRegionToken} from '@angular/fire/functions';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {MatTabsModule} from "@angular/material/tabs";
import { RoutesManagementComponent } from './routes-management/routes-management.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { RoutePointSelectorComponent } from './routes-management/route-point-selector/route-point-selector.component';
import {ColorPickerModule} from "ngx-color-picker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ContenteditableModel,
    ManagementTableComponent,
    RoutesManagementComponent,
    RoutePointSelectorComponent
  ],
  imports: [
    DataFormsModule,
    CdkTableModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTabsModule,
    DragDropModule,
    ReactiveFormsModule,
    ColorPickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    MatCheckboxModule,
    RouterModule.forRoot([])
  ],
  providers: [DataService,
    { provide: FunctionsRegionToken, useValue: 'europe-west1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
