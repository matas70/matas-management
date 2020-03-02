import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {Route} from "../models/route.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Point} from "../models/point.model";

@Component({
  selector: 'routes-management',
  templateUrl: './routes-management.component.html',
  styleUrls: ['./routes-management.component.less']
})
export class RoutesManagementComponent implements OnInit {

  public routes: Route[];
  public points: Point[];

  constructor(private _store: Store<any>) {

  }

  ngOnInit() {
    this._store.select('routes').subscribe((routes: Map<number, Route>) => {
      this.routes = Array.from(routes.values());
    });

    this._store.select('points').subscribe((points: Map<number, Point>) => {
      this.points = Array.from(points.values());
    });
  }

  drop(event: CdkDragDrop<Route[]>, index: number): void {
    moveItemInArray(this.routes[index].points, event.previousIndex, event.currentIndex);
  }

  changePointOfRoute(newPoint: Point, routeIndex: number, pointIndex: number): void {
    this.routes[routeIndex].points[pointIndex] = newPoint;
  }

  getAvailablePointsForRoute(route: Route) {
    let points1 = this.points.filter((point: Point) => {
      return !route.points.find((routePoint: Point) => routePoint.pointId === point.pointId);
    });
    return points1;
  }
}
