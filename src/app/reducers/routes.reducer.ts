import {ActionType} from './action-types.enum';
import {Route} from "../models/route.model";

export function routesReducer(state: Map<number, Route> = new Map(), action: any) {
  switch (action.type) {
    case (ActionType.SET_ROUTES):
      return action.payload.routes;

    case (ActionType.ADD_UPDATE_ROUTE):
      let newMap = new Map(state);
      newMap.set(action.payload.route.routeId, action.payload.route);
      return newMap;

    default:
      return state;
  }
}
