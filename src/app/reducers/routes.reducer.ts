import {ActionType} from './action-types.enum';
import {Route} from "../models/route.model";
import {AddUpdateRoute, DeleteRoute, RoutesActionUnion, SetRoutes} from "./routes.actions";

export function routesReducer(state: Map<number, Route> = new Map(), action: RoutesActionUnion) {
  switch (action.type) {
    case (ActionType.SET_ROUTES):
      return (action as SetRoutes).payload.routes;

    case (ActionType.ADD_UPDATE_ROUTE): {
      let newMap = new Map(state);
      newMap.set((action as AddUpdateRoute).payload.route.routeId, (action as AddUpdateRoute).payload.route);
      return newMap;
    }
    case (ActionType.DELETE_ROUTE): {
      let newMap = new Map(state);
      newMap.delete((action as DeleteRoute).payload.route.routeId);
      return newMap;
    }
    default:
      return state;
  }
}
