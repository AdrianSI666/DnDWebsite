
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, PlaneContinentControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewContinentToPlane, removeContinentFromPlane } from "./store/onePlaneSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewContinentToPlane: (continentDTO: EntryDTO) => {
        dispatch(addNewContinentToPlane(continentDTO))
    },
    removeContinentFromPlane: (continentId: number) => {
        dispatch(removeContinentFromPlane(continentId))
    }
})

export function OnePlaneSubObjectsFunction() {
    const { addNewContinentToPlane, removeContinentFromPlane } = actionDispatch(useAppDispatch());
    const saveNewContinentToPlane = async (planeId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return PlaneContinentControllerService.addNewContinentPlaneRelation(planeId, entryDTO)
            .then((res) => {
                addNewContinentToPlane(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingContinentToPlane = async (planeId: number, continentId: number, continentName: string, continentDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: continentName,
            description: continentDescription,
            id: continentId
        }
        return PlaneContinentControllerService.addPlaneContinentRelation(planeId, continentId)
            .then(() => {
                addNewContinentToPlane(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllContinentsWithoutPlane = async () => {
        return await PlaneContinentControllerService.getAllContinentsWithoutPlane()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeContinentFromPlaneFunction = async (planeId: number, continentId: number): Promise<void> => {
        return PlaneContinentControllerService.removePlaneContinentRelation(planeId, continentId)
            .then(() => {
                removeContinentFromPlane(continentId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction, getAllContinentsWithoutPlane };
}