import {PointsActionsUnion} from './points.actions';
import {ActionType} from './action-types.enum';
import {Point} from '../models/point.model';

export function pointsReducer(state = new Map<number, Point>(), action: any) {
  switch (action.type) {
    case (ActionType.SET_POINTS):
      return action.payload.points;

    case (ActionType.ADD_UPDATE_POINT): {
      let newMap = new Map(state);
      newMap.set(action.payload.point.pointId, action.payload.point);
      return newMap;
    }
    case (ActionType.DELETE_POINT): {
      let newMap = new Map(state);
      newMap.delete(action.payload.point.pointId);
      return newMap;
    }
    default:
      return state;
  }
}
