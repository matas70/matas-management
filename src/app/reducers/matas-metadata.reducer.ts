import {MatasMetadata} from "../models/matas-metadata.model";
import {ActionType} from "./action-types.enum";

export function matasMetadataReducer(state: MatasMetadata, action: any) {
  switch (action.type) {
    case (ActionType.ADD_UPDATE_MATAS_METADATA): {
      return {...state, ...action.payload.matasMetadata}
    }
  }
}
