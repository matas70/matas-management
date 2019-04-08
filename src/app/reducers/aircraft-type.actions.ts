import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {AircraftType} from "../models/aircraft-type.model";
import {Aircraft} from "../models/aircraft.model";

export class SetAircraftTypes implements Action {
  readonly type: ActionType = ActionType.SET_AIRCRAFT_TYPES;

  constructor(public payload: {aircraftTypes: Map<number, AircraftType>}) {}
}

export class AddAircraftType implements Action {
  readonly type: ActionType = ActionType.ADD_AIRCRAFT_TYPE;

  constructor(public payload: {aircraftType: AircraftType}) {}
}

export type AircraftTypesActionUnion = SetAircraftTypes | AddAircraftType;
