import { Component } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {DataService} from "./data/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'matas-management';

  constructor(private store: Store<any>, data: DataService) {
    data.loadData();
    store.select("aircraft").subscribe(aircraft => {
      console.log(aircraft);
    });
    store.select("matasMetadata").subscribe((data) => console.log(data));
  }
}
