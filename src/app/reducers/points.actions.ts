import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {Point} from "../models/point.model";

export class SetPoints implements Action {
  type: ActionType = ActionType.SET_POINTS;

  constructor(public payload: {points: Map<number, Point>}) {}
}

export class AddUpdatePoint implements Action {
  type: ActionType = ActionType.ADD_UPDATE_POINT;

  constructor(public payload: {point: Point}) {}
}

export class DeletePoint implements Action {
  type: ActionType = ActionType.DELETE_POINT;


  constructor(public payload: {point: Point}) {}
}

export type PointsActionsUnion = SetPoints | AddUpdatePoint;
