import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Route} from "../models/route.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Point} from "../models/point.model";
import {AddUpdateRoute} from "../reducers/routes.actions";

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
      this.routes.forEach((route: Route) => {
        route.color = `#${route.color}`;
        route.primaryTextColor = `#${route.primaryTextColor}`;
        route.secondaryTextColor = `#${route.secondaryTextColor}`;
      });
    });

    this._store.select('points').subscribe((points: Map<number, Point>) => {
      this.points = Array.from(points.values());
    });
  }

  updateRoute(route: Route) {
    this._store.dispatch(new AddUpdateRoute({route: route}));
  }

  routeNameEnter(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      let currentTarget: any = event.currentTarget;
      currentTarget.blur();
    }

    this.updateRoute(this.routes[index]);
  }

  drop(event: CdkDragDrop<Route[]>, index: number): void {
    moveItemInArray(this.routes[index].points, event.previousIndex, event.currentIndex);
    this.updateRoute(this.routes[index]);
  }

  changePointOfRoute(newPoint: Point, routeIndex: number, pointIndex: number): void {
    this.routes[routeIndex].points[pointIndex] = newPoint;
    this.updateRoute(this.routes[routeIndex]);
  }

  addPointToRoute(routeIndex: number) {
    let relevantRoute = this.routes[routeIndex];
    let unusedPoint = this.points.find((point: Point) => !relevantRoute.points.find((routePoint: Point) => routePoint.pointId === point.pointId));
    if (unusedPoint) {
      relevantRoute.points.push(unusedPoint)
    }

    this.updateRoute(relevantRoute);
  }

  getAvailablePointsForRoute(route: Route, currentPoint: Point) {
    let points1 = this.points.filter((point: Point) => {
      return !route.points.find((routePoint: Point) => routePoint.pointId === point.pointId);
    });

    points1.push(currentPoint);

    return points1;
  }

  removePointOfRoute(routeIndex: number, pointInRouteIndex: number) {
    this.routes[routeIndex].points.splice(pointInRouteIndex, 1);
    this.updateRoute(this.routes[routeIndex]);
  }

  addRoute() {
    let route = new Route(this.routes.length, `מסלול ${this.routes.length}`, "#FF0000");
    this.routes.push(route);
    this.updateRoute(route);
  }

  removeRoute(routeIndex: number) {
    this.routes.splice(routeIndex, 1);
    // this._store.dispatch(new Delete)
  }

  changeVisibilityOfPointInRoute($event: boolean, routeIndex: number, pointInRouteIndex: number) {
    this.routes[routeIndex].points[pointInRouteIndex].hidden = $event;
  }
}
