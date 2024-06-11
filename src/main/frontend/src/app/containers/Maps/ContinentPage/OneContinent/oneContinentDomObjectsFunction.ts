import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, PlaneControllerService, PlaneContinentControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { removePlaneFromContinent, setPlaneToContinent } from "./store/oneContinentSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setPlaneToContinent: (planeEntryDTO: EntryDTO) => {
        dispatch(setPlaneToContinent(planeEntryDTO))
    },
    removePlaneFromContinent: () => {
        dispatch(removePlaneFromContinent())
    }
})

export function OneContinentDomObjectsFunction() {
    const { setPlaneToContinent, removePlaneFromContinent } = actionDispatch(useAppDispatch());

    const setNewPlaneToContinent = async (continentId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return PlaneContinentControllerService.addNewPlaneContinentRelation(continentId, entryDTO)
            .then((result) => {
                setPlaneToContinent(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const setExistingPlaneToContinent = async (continentId: number, planeId: number, planeName: string, planeDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: planeName,
            shortDescription: planeDescription,
            id: planeId
        }
        return PlaneContinentControllerService.addPlaneContinentRelation(planeId, continentId)
            .then(() => {
                setPlaneToContinent(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllPlanes = async () => {
        return await PlaneControllerService.getAllPlanes()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removePlaneFromContinentFunction = async (continentId: number, planeId: number): Promise<void> => {
        return PlaneContinentControllerService.removePlaneContinentRelation(planeId, continentId)
            .then(() => {
                removePlaneFromContinent();
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes };
}
