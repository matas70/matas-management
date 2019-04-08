import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {AircraftType} from "../models/aircraft-type.model";
import {Point} from "../models/point.model";

export class SetAircraftTypes implements Action {
  type: ActionType = ActionType.SET_AIRCRAFT_TYPES;

  constructor(public payload: {aircraftTypes: AircraftType[]}) {}
}

export class AddAircraftType implements Action {
  type: ActionType = ActionType.ADD_AIRCRAFT_TYPE;

  constructor(public payload: {aircraftType: AircraftType}) {}
}

export type AircraftTypesActionUnion = SetAircraftTypes | AddAircraftType;
