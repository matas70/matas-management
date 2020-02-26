import {Action} from '@ngrx/store';
import {ActionType} from './action-types.enum';
import * as AircraftActions from './aircraft.actions';
import {AircraftActionsUnion} from './aircraft.actions';

export function aircraftReducer(state = new Map(), action: any) {
  switch (action.type) {
    case (ActionType.SET_AIRCRAFT): {
      return action.payload.aircraft;
    } case (ActionType.ADD_UPDATE_AIRCRAFT): {
      let newMap = new Map(state);
      newMap.set(action.payload.aircraft.aircraftId, action.payload.aircraft);
      return newMap;
    } case (ActionType.DELETE_AIRCRAFT): {
      let newMap = new Map();
      let i = 1;
      state.delete(action.payload.aircraft.aircraftId);
      state.forEach((val, key) => {
        val.aircraftId = i;
        newMap.set(i, val);
        i++;
      });
      return newMap;
    }
    default:
      return state;
  }
}
