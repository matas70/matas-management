import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManagementTableComponent } from './management-table/management-table.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {DataResolver} from "./data/data.resolver";

@NgModule({
  declarations: [
    AppComponent,
    ManagementTableComponent
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: '*',
        component: AppComponent,
        resolve: {
          data: DataResolver
        }
      }
    ]),
    BrowserModule,
    BrowserAnimationsModule,

  ],
  providers: [DataResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
