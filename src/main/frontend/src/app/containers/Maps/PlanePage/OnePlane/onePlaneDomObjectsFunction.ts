
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, WorldControllerService, WorldPlaneControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { removeWorldFromPlane, setWorldToPlane } from "./store/onePlaneSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setWorldToPlane: (worldEntryDTO: EntryDTO) => {
        dispatch(setWorldToPlane(worldEntryDTO))
    },
    removeWorldFromPlane: () => {
        dispatch(removeWorldFromPlane())
    }
})

export function OnePlaneDomObjectsFunction() {
    const { setWorldToPlane, removeWorldFromPlane } = actionDispatch(useAppDispatch());

    const setNewWorldToPlane = async (planeId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return WorldPlaneControllerService.addNewWorldPlaneRelation(planeId, entryDTO)
            .then((result) => {
                setWorldToPlane(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const setExistingWorldToPlane = async (planeId: number, worldId: number, worldName: string, worldDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: worldName,
            description: worldDescription,
            id: worldId
        }
        return WorldPlaneControllerService.addWorldPlaneRelation(worldId, planeId)
            .then(() => {
                setWorldToPlane(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllWorlds = async () => {
        return await WorldControllerService.getAllWorlds()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeWorldFromPlaneFunction = async (planeId: number, worldId: number): Promise<void> => {
        return WorldPlaneControllerService.removeWorldPlaneRelation(worldId, planeId)
            .then(() => {
                removeWorldFromPlane();
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewWorldToPlane, setExistingWorldToPlane, removeWorldFromPlaneFunction, getAllWorlds };
}
