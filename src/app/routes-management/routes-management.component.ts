import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {Route} from "../models/route.model";

@Component({
  selector: 'routes-management',
  templateUrl: './routes-management.component.html',
  styleUrls: ['./routes-management.component.less']
})
export class RoutesManagementComponent implements OnInit {

  public routes: Map<number, Route>;

  constructor(private _store: Store<any>) {
    this._store.select('routes').subscribe((routes: Map<number, Route>) => {
      this.routes = routes
    });
  }

  ngOnInit() {
  }

}
