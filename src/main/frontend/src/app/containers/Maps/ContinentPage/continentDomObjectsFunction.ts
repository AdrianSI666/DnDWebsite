
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, PlaneControllerService, PlaneContinentControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { removePlaneFromContinent, setPlaneToContinent } from "./store/continentPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  setPlaneToContinent: (continentId: number, planeDTO: EntryDTO) => {
    dispatch(setPlaneToContinent({
        continentId,
        planeDTO
    }))
  },
  removePlaneFromContinent: (continentId: number, planeId: number) => {
    dispatch(removePlaneFromContinent({
        continentId,
        subObjectId: planeId
    }))
  }
})

export function ContinentDomObjectsFunction() {
  const { setPlaneToContinent, removePlaneFromContinent } = actionDispatch(useAppDispatch());

  const setNewPlaneToContinent = async (continentId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return PlaneContinentControllerService.addNewPlaneContinentRelation(continentId, entryDTO)
      .then((result) => {
        setPlaneToContinent(continentId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingPlaneToContinent = async (continentId: number, planeId: number, planeName: string, planeDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: planeName,
      description: planeDescription,
      id: planeId
    }
    return PlaneContinentControllerService.addPlaneContinentRelation(planeId, continentId)
      .then(() => {
        setPlaneToContinent(continentId, entryDTO);
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
        removePlaneFromContinent(continentId, planeId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewPlaneToContinent, setExistingPlaneToContinent, getAllPlanes, removePlaneFromContinentFunction };
}