import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Point} from "../../models/point.model";
import {MatSelectChange} from "@angular/material/select";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'route-point-selector',
  templateUrl: './route-point-selector.component.html',
  styleUrls: ['./route-point-selector.component.less']
})
export class RoutePointSelectorComponent implements OnInit {

  currentPointControl = new FormControl();

  @Output()
  currentPointChange: EventEmitter<Point> = new EventEmitter<Point>();
  @Input()
  availablePoints: Point[] = [];
  @Input()
  currentPointId: number;
  @Output()
  pointRemoved: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  pointVisibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentPoint: Point;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // if (this.availablePoints) {
    //   this.currentPoint = this.availablePoints[0];
    // }
    // console.log(this.currentPoint);
    let point = this.availablePoints.find((point: Point) => point.pointId === this.currentPointId);
    this.currentPoint = point;
    this.currentPointControl.setValue(point);
    this.currentPointControl.valueChanges.subscribe((newVal: Point) => this.currentPointChange.emit(newVal));
  }

  currentPointChanged(event: MatSelectChange) {
    this.currentPointChange.emit(event.value);
    this.currentPoint = event.value;
  }

  comparePoints(point1: Point, point2: Point) {
    return point1.pointId === point2.pointId;
  }
}
