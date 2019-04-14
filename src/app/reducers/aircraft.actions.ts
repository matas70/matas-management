import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {Aircraft} from "../models/aircraft.model";

export class SetAircraft implements Action {
  type: ActionType = ActionType.SET_AIRCRAFT;

  constructor(public payload: {aircraft: Map<number, Aircraft>}) {}
}

export class AddUpdateAircraft implements Action {
  type: ActionType = ActionType.ADD_UPDATE_AIRCRAFT;

  constructor(public payload: {aircraft: Aircraft}) {}
}
export class DeleteAircraft implements Action {
  type: ActionType = ActionType.ADD_UPDATE_AIRCRAFT;

  constructor(public payload: { aircraft: Aircraft }) {
  }
}

export type AircraftActionsUnion = SetAircraft | AddUpdateAircraft | DeleteAircraft;
