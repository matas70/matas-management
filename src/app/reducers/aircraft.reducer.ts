import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import * as AircraftActions from "./aircraft.actions";
import {AircraftActionsUnion} from "./aircraft.actions";

export function aircraftReducer(state = [], action: any) {
  switch (action.type) {
    case (ActionType.SET_AIRCRAFT):
      return action.payload.aircraft;
    case (ActionType.ADD_AIRCRAFT):
      return [].concat(state).push(action.payload.aircraft);
    default:
      return state;
  }
}
