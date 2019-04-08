import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManagementTableComponent } from './management-table/management-table.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {select, Store, StoreModule} from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import {RouterModule} from "@angular/router";
import {DataResolver} from "./data/data.resolver";
import {DataService} from "./data/data.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ManagementTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
