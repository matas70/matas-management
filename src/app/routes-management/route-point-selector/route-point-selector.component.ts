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
  currentPoint: Point;

  currentPointId: number;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // if (this.availablePoints) {
    //   this.currentPoint = this.availablePoints[0];
    // }
    // console.log(this.currentPoint);
    this.currentPointControl.setValue(this.currentPoint.pointId);
    this.currentPointId = this.currentPoint.pointId;
  }

  currentPointChanged(event: MatSelectChange) {
    // this.currentPoint = event.value;
    // this.currentPointChange.emit(this.currentPoint);
  }

  comparePoints(point1: Point, point2: Point) {
    return point1.pointId === point2.pointId;
  }
}
