import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Route} from "../models/route.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Point} from "../models/point.model";
import {AddUpdateRoute, DeleteRoute} from "../reducers/routes.actions";

@Component({
  selector: 'routes-management',
  templateUrl: './routes-management.component.html',
  styleUrls: ['./routes-management.component.less']
})
export class RoutesManagementComponent implements OnInit {

  public colors: {name: string, color: string, primaryTextColor: string, secondaryTextColor: string}[] = [
    {
      "name": "כחול",
      "color": "#3bb5f2",
      "primaryTextColor": "ffffff",
      "secondaryTextColor": "187aab"
    },
    {
      "name": "סגול",
      "color": "#bb7aff",
      "primaryTextColor": "ffffff",
      "secondaryTextColor": "bb7aff"
    },
    {
      "name": "ירוק",
      "color": "#64e1a5",
      "primaryTextColor": "ffffff",
      "secondaryTextColor": "64e1a5",
    },
    {
      "name": "אדום",
      "color": "#f64b58",
      "primaryTextColor": "ffffff",
      "secondaryTextColor": "64e1a5",
    },
    {
      "name": "סגול 2",
      "color": "#bb7aff",
      "primaryTextColor": "ffffff",
      "secondaryTextColor": "187aab",
    }
  ];

  public routes: Route[];
  public points: Point[];

  constructor(private _store: Store<any>) {

  }

  ngOnInit() {
    this._store.select('routes').subscribe((routes: Map<number, Route>) => {
      this.routes = Array.from(routes.values());
      
      // this.fixRouteColors();
    });

    this._store.select('points').subscribe((points: Map<number, Point>) => {
      this.points = Array.from(points.values());
    });
  }

  private fixRouteColors() {
    this.routes.forEach((route: Route) => {
      if (route.color && !route.color.startsWith('#')) {
        route.color = `#${route.color}`;
      }

      if (route.primaryTextColor && !route.primaryTextColor.startsWith('#')) {
        route.primaryTextColor = `#${route.primaryTextColor}`;
      }

      if (route.secondaryTextColor && !route.secondaryTextColor.startsWith('#')) {
        route.secondaryTextColor = `#${route.secondaryTextColor}`;
      }
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
    let route = new Route(this.routes.length + 1, `מסלול ${this.routes.length + 1}`, "#FF0000");
    this.routes.push(route);
    this.updateRoute(route);
  }

  removeRoute(routeIndex: number) {
    this._store.dispatch(new DeleteRoute({route: this.routes[routeIndex]}))
    // this.routes.splice(routeIndex, 1);
  }

  changeVisibilityOfPointInRoute($event: boolean, routeIndex: number, pointInRouteIndex: number) {
    this.routes[routeIndex].points[pointInRouteIndex].hidden = $event;
    this.updateRoute(this.routes[routeIndex]);
  }

  changeColorOfRoute(routeIndex: number, color: {name: string, color: string, primaryTextColor: string, secondaryTextColor: string}) {
    this.routes[routeIndex].color = color.color.replace('#', '');
    this.routes[routeIndex].primaryTextColor = color.primaryTextColor;
    this.routes[routeIndex].secondaryTextColor = color.secondaryTextColor;
    this.updateRoute(this.routes[routeIndex]);
  }

  getColorOfRoute(route: Route) {
    let find = this.colors.find((color: {name: string, color: string, primaryTextColor: string, secondaryTextColor: string}) => {
      return color.color.includes(route.color);
    });
    return find;
  }
}
