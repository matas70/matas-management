import { Component } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {DataService} from './data/data.service';
import { MatDialog } from '@angular/material/dialog';

import { DataFormsAircraftComponent } from './data-forms/data-forms-aircraft/data-forms-aircraft.component';
import { DataFormsAircraftTypeComponent } from './data-forms/data-forms-aircrafttype/data-forms-aircrafttype.component';
import { DataFormsPointComponent } from './data-forms/data-forms-point/data-forms-point.component';
import { Aircraft } from './models/aircraft.model';
import { AircraftType } from './models/aircraft-type.model';
import { Point } from './models/point.model';
import { DataFormsMetadataComponent } from './data-forms/data-forms-metadata/data-forms-metadada.component';
import { MatasMetadata } from './models/matas-metadata.model';
import {Subject} from 'rxjs';
import {DataFormsNotificationComponent} from './data-forms/data-forms-notification/data-forms-notification.component';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'matas-management';
  matasMetadata: MatasMetadata = undefined;

  public subject: Subject<any> = new Subject();
  private dataPulse = 0;
  public unsavedChanged = false;
  public productionPush = false;
  public readyState = false;
  public loadingText = "רק רגע"
  
  constructor(private store: Store<any>, private data: DataService, public dialog: MatDialog) {

    data.activatedRoute.queryParams.subscribe(params => {
      if (params['_x']?.length > 10) {
        data.loadData();
      }

      setTimeout(() => {
        if (params['_x']?.length < 10 || !params['_x']) {
          this.loadingText = "יש מצב שאתם.. אפילו אם בטעות, לא במקום הנכון?"
        }
      }, 2000);
    });

    store.select('aircraft').subscribe(aircraft => {
      this.dataPulse++;
      if (this.dataPulse > 10) this.unsavedChanges();
      if (this.dataPulse > 9) this.readyState = true;
    });

    store.select('matasMetadata').subscribe((metaData) => {
      this.dataPulse++;
      if (this.dataPulse > 10) this.unsavedChanges();
      if (this.dataPulse > 9) this.readyState = true;
      if (metaData != undefined) {
        this.matasMetadata = metaData;
      }
    });

    this.store.select('points').subscribe(data => {
      this.dataPulse++;
      if (this.dataPulse > 10) this.unsavedChanges();
      if (this.dataPulse > 9) this.readyState = true;
    });

    this.store.select('aircraftTypes').subscribe(data => {
      this.dataPulse++;
      if (this.dataPulse > 10) this.unsavedChanges();
      if (this.dataPulse > 9) this.readyState = true;
    });

    this.store.select('routes').subscribe(data => {
      this.dataPulse++;
      if (this.dataPulse > 10) this.unsavedChanges();
      if (this.dataPulse > 9) this.readyState = true;
    });
  }

  unsavedChanges() {
    this.unsavedChanged = true;
    this.productionPush = false;
  }

  saveAll() {
    this.saveClicked();
    this.saveRoutesClicked();
    this.unsavedChanged = false;
    this.productionPush = true;
  }

  publishProduction() {
    this.productionPush = false;
    this.data.tempSave('matas');
    this.data.saveRoutes('matas');
  }

  saveClicked() {
    this.data.tempSave('matas-dev');
    this.subject.next();
  }

  saveRoutesClicked() {
    this.data.saveRoutes('matas-dev');
  }

  openDialog(dataType: string): void {
    let dialogRefInput;
    if (dataType == 'aircraft')
          dialogRefInput = this.dialog.open(DataFormsAircraftComponent, {
          width: '250px',
          data: new Aircraft()
        });
    else if (dataType == 'aircrafttype')
        dialogRefInput = this.dialog.open(DataFormsAircraftTypeComponent, {
          width: '450px',
          data: new AircraftType()
        });
    else if (dataType == 'aircrafttypeupdate')
        dialogRefInput = this.dialog.open(DataFormsAircraftTypeComponent, {
          width: '450px',
          data: new AircraftType().setJson({name: 'new'})
        });
    else if (dataType == 'point')
        dialogRefInput = this.dialog.open(DataFormsPointComponent, {
          width: '250px',
          data: new Point()
        });
    else if (dataType == 'notification')
      dialogRefInput = this.dialog.open(DataFormsNotificationComponent, {
        width: '350px'
      });
    else {
        dialogRefInput = this.dialog.open(DataFormsMetadataComponent, {
          width: '250px',
          data: this.matasMetadata
        });
    }

    const dialogRef = dialogRefInput;
  }
}
