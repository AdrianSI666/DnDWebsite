
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
        subObjectId: planeId
    }))
  }
})

export function WorldSubObjectsFunction() {
  const { addNewPlaneToWorld, removePlaneFromWorld } = actionDispatch(useAppDispatch());

  const getAllPlanesWithoutWorld = async () => {
    return await WorldPlaneControllerService.getAllPlanesWithoutWorld()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewPlaneToWorld = async (worldId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
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

  const saveExistingPlaneToWorld = async (worldId: number, planeId: number, planeName: string, planeDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: planeName,
      shortDescription: planeDescription,
      id: planeId
    }
    return WorldPlaneControllerService.addWorldPlaneRelation(worldId, planeId)
      .then(() => {
        addNewPlaneToWorld(worldId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removePlaneFromWorldFunction = async (worldId: number, planeId: number): Promise<void> => {
    return WorldPlaneControllerService.removeWorldPlaneRelation(worldId, planeId)
      .then(() => {
        removePlaneFromWorld(worldId, planeId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction, getAllPlanesWithoutWorld };
}