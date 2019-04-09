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
import {aircraftTypesReducer} from "./aircraft-type.reducer";
import {matasMetadataReducer} from "./matas-metadata.reducer";

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  points: pointsReducer,
  aircraft: aircraftReducer,
  aircraftTypes: aircraftTypesReducer,
  matasMetadata: matasMetadataReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
