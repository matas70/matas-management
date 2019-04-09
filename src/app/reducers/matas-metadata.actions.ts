import {Action} from "@ngrx/store";
import {ActionType} from "./action-types.enum";
import {MatasMetadata} from "../models/matas-metadata.model";

export class AddUpdateMatasMetadata implements Action {
  type: ActionType = ActionType.ADD_UPDATE_MATAS_METADATA;

  constructor(public payload: {matasMetadata: MatasMetadata}) {}
}

export type MatasMetadataActionsUnion = AddUpdateMatasMetadata;
