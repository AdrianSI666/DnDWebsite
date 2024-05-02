
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, WorldPlaneControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addNewPlaneToWorld, removePlaneFromWorld } from "./store/worldPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewPlaneToWorld: (worldId: number, planeDTO: EntryDTO) => {
    dispatch(addNewPlaneToWorld({
        worldId,
      planeDTO
    }))
  },
  removePlaneFromWorld: (worldId: number, planeId: number) => {
    dispatch(removePlaneFromWorld({
        worldId,
        planeId
    }))
  }
})

export function WorldSubObjectsFunction() {
  const { addNewPlaneToWorld, removePlaneFromWorld } = actionDispatch(useAppDispatch());
  const saveNewPlaneToWorld = async (worldId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return WorldPlaneControllerService.addNewPlaneWorldRelation(worldId, entryDTO)
      .then((result) => {
        addNewPlaneToWorld(worldId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingPlaneToWorld = async (worldId: number, PlaneId: number, PlaneName: string, PlaneDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: PlaneName,
      description: PlaneDescription,
      id: PlaneId
    }
    return WorldPlaneControllerService.addWorldPlaneRelation(PlaneId, worldId)
      .then(() => {
        addNewPlaneToWorld(worldId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removePlaneFromWorldFunction = async (worldId: number, PlaneId: number): Promise<void> => {
    return WorldPlaneControllerService.removePlaneWorldRelation(PlaneId, worldId)
      .then(() => {
        removePlaneFromWorld(worldId, PlaneId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction };
}