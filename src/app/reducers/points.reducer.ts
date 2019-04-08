import {PointsActionsUnion} from "./points.actions";
import {ActionType} from "./action-types.enum";

export function pointsReducer(state = [], action: PointsActionsUnion) {
  switch (action.type) {
    case (ActionType.SET_POINTS):
      return action.payload.points;

    case (ActionType.ADD_POINT):
      return [].concat(state).push(action.payload.point);

    default:
      return state;
  }
}
