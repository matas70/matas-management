import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {pointsReducer} from "./points.reducer";
import {aircraftReducer} from "./aircraft.reducer";

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  points: pointsReducer,
  aircraft: aircraftReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
