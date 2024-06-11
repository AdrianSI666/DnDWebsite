
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, WorldPlaneControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewPlaneToWorld, removePlaneFromWorld } from "./store/oneWorldSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewPlaneToWorld: (planeDTO: EntryDTO) => {
        dispatch(addNewPlaneToWorld(planeDTO))
    },
    removePlaneFromWorld: (planeId: number) => {
        dispatch(removePlaneFromWorld(planeId))
    }
})

export function OneWorldSubObjectsFunction() {
    const { addNewPlaneToWorld, removePlaneFromWorld } = actionDispatch(useAppDispatch());
    const saveNewPlaneToWorld = async (worldId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return WorldPlaneControllerService.addNewPlaneWorldRelation(worldId, entryDTO)
            .then((res) => {
                addNewPlaneToWorld(res);
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
                console.log("Eixsting plane: ")
                console.log(entryDTO)
                addNewPlaneToWorld(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllPlanesWithoutWorld = async () => {
        return await WorldPlaneControllerService.getAllPlanesWithoutWorld()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removePlaneFromWorldFunction = async (worldId: number, planeId: number): Promise<void> => {
        return WorldPlaneControllerService.removeWorldPlaneRelation(worldId, planeId)
            .then(() => {
                removePlaneFromWorld(planeId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction, getAllPlanesWithoutWorld };
}