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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'matas-management';
  matasMetadata: MatasMetadata;
  public subject: Subject<any> = new Subject();

  constructor(private store: Store<any>, private data: DataService, public dialog: MatDialog) {
    data.loadData();
    store.select('aircraft').subscribe(aircraft => {
      console.log(aircraft);
    });

    store.select('matasMetadata').subscribe((metaData) => {
      console.log(metaData);
      if (metaData != undefined) {
        this.matasMetadata = metaData;
      }
    });
  }

  saveClicked() {
    this.data.tempSave();
    this.subject.next();
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
