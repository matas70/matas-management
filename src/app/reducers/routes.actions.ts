import {Action} from '@ngrx/store';
import {ActionType} from './action-types.enum';
import {Route} from "../models/route.model";

export class SetRoutes implements Action {
  readonly type: ActionType = ActionType.SET_ROUTES;

  constructor(public payload: {routes: Map<number, Route>}) {}
}

export class AddRoute implements Action {
  readonly type: ActionType = ActionType.ADD_UPDATE_ROUTE;

  constructor(public payload: {routes: Route}) {}
}

export type RoutesActionUnion = SetRoutes | AddRoute;
