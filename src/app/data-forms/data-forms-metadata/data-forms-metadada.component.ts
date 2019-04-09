import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';

import { MatasMetadata } from '../../models/matas-metadata.model';
import { AddUpdateMatasMetadata } from 'src/app/reducers/matas-metadata.actions';

@Component({
  selector: 'app-data-forms-metadata',
  templateUrl: './data-forms-metadata.html'
})
export class DataFormsMetadataComponent implements OnInit {

    onOkClick() {
      this.store.dispatch(new AddUpdateMatasMetadata({matasMetadata: this.metadataData}));

      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    constructor(public dialogRef: MatDialogRef<DataFormsMetadataComponent>,
                @Inject(MAT_DIALOG_DATA) public metadataData: MatasMetadata,
                public store: Store<any>) {
     }

    ngOnInit() {}

}
