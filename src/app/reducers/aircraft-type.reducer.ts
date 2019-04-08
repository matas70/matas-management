import {AircraftActionsUnion} from "./aircraft.actions";
import {ActionType} from "./action-types.enum";
import {AircraftTypesActionUnion} from "./aircraft-type.actions";

export function aircraftTypesReducer(state = [], action: any) {
  switch (action.type) {
    case (ActionType.SET_AIRCRAFT_TYPES):
      return action.payload.aircraftTypes;

    case (ActionType.ADD_AIRCRAFT_TYPE):
      let newMap = new Map(state);
      newMap.set(action.payload.aircraftType.aircraftTypeId, action.payload.aircraftType);
      return newMap;

    default:
      return state;
  }
}
