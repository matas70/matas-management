import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataFormsModule} from './data-forms/data-forms.module';
import { AppComponent } from './app.component';
import { ManagementTableComponent } from './management-table/management-table.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatTableModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatSortModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule, MatInputModule
} from "@angular/material";
import {StoreModule} from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import {DataService} from "./data/data.service";
import {HttpClientModule} from "@angular/common/http";
import {ContenteditableModel} from "./management-table/content-editable.directive";
import {FormsModule} from "@angular/forms";
import {CdkTableModule} from "@angular/cdk/table";
import {AngularFireFunctionsModule, FunctionsRegionToken} from "@angular/fire/functions";
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire";

@NgModule({
  declarations: [
    AppComponent,
    ContenteditableModel,
    ManagementTableComponent
  ],
  imports: [
    DataFormsModule,
    CdkTableModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
  ],
  providers: [DataService,
    { provide: FunctionsRegionToken, useValue: 'europe-west1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
