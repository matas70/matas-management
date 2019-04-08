import {AircraftActionsUnion} from "./aircraft.actions";
import {ActionType} from "./action-types.enum";
import {AircraftTypesActionUnion} from "./aircraft-type.actions";

export function aircraftTypesReducer(state = [], action: any) {
  switch (action.type) {
    case (ActionType.SET_AIRCRAFT):
      return action.payload.aircraftTypes;
    case (ActionType.ADD_AIRCRAFT):
      return [].concat(state).push(action.payload.aircraftType);
    default:
      return state;
  }
}
