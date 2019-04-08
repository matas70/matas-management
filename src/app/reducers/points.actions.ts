import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {Point} from "../models/point.model";
import {Aircraft} from "../models/aircraft.model";

export class SetPoints implements Action {
  type: ActionType = ActionType.SET_POINTS;

  constructor(public payload: {points: Map<number, Point>}) {}
}

export class AddPoint implements Action {
  type: ActionType = ActionType.ADD_POINT;

  constructor(public payload: {point: Point}) {}
}

export type PointsActionsUnion = SetPoints | AddPoint;
