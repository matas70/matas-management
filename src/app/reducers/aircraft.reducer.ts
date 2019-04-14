import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import * as AircraftActions from "./aircraft.actions";
import {AircraftActionsUnion} from "./aircraft.actions";

export function aircraftReducer(state = [], action: any) {
  switch (action.type) {
    case (ActionType.SET_AIRCRAFT):
      return action.payload.aircraft;

    /*case (ActionType.ADD_AIRCRAFT):
      let newMap = new Map(state);
      newMap.set(action.payload.aircraft.aircraftId, action.payload.aircraft);
      return newMap;*/

    default:
      return state;
  }
}
