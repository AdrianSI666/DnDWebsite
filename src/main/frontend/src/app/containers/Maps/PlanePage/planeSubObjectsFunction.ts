
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, PlaneContinentControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addNewContinentToPlane, removeContinentFromPlane } from "./store/planePageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewContinentToPlane: (planeId: number, continentDTO: EntryDTO) => {
    dispatch(addNewContinentToPlane({
        planeId,
      continentDTO
    }))
  },
  removeContinentFromPlane: (planeId: number, continentId: number) => {
    dispatch(removeContinentFromPlane({
        planeId,
        subObjectId: continentId
    }))
  }
})

export function PlaneSubObjectsFunction() {
  const { addNewContinentToPlane, removeContinentFromPlane } = actionDispatch(useAppDispatch());

  const getAllContinentsWithoutPlane = async () => {
    return await PlaneContinentControllerService.getAllContinentsWithoutPlane()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewContinentToPlane = async (planeId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return PlaneContinentControllerService.addNewContinentPlaneRelation(planeId, entryDTO)
      .then((result) => {
        addNewContinentToPlane(planeId, result);
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
        addNewContinentToPlane(planeId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeContinentFromPlaneFunction = async (planeId: number, continentId: number): Promise<void> => {
    return PlaneContinentControllerService.removePlaneContinentRelation(planeId, continentId)
      .then(() => {
        removeContinentFromPlane(planeId, continentId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction, getAllContinentsWithoutPlane };
}