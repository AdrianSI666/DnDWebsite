import { ApiError, RaceControllerService, EntryDTO, EntryFullDTO, ImageDTO, RaceSubRaceControllerService } from "../../../services/openapi";
import '../../styles/masonary.css';
import { addImageToRace, addNewSubRaceToRace, removeRace, removeImageFromRace, removeSubRaceFromRace, updateRace } from "./store/racePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import "../../styles/subObjects.css"
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";
import { Accordion } from "react-bootstrap";

interface IRaceAccordionBody {
  race: EntryFullDTO
}

const actionDispatch = (dispatch: Dispatch) => ({
  removeRace: (id: number) => {
    dispatch(removeRace(id))
  },
  updateRace: (id: number, entryDTO: EntryDTO) => {
    dispatch(updateRace({ id, entryDTO }))
  },
  addImageToRace: (imageDTO: ImageDTO, raceId: number) => {
    let payload = {
      raceId,
      imageDTO
    }
    dispatch(addImageToRace(payload))
  },
  removeImageFromRace: (imageId: number, raceId: number) => {
    dispatch(removeImageFromRace({
      raceId,
      imageId
    }))
  },
  addNewSubRaceToRace: (raceId: number, subRaceDTO: EntryDTO) => {
    dispatch(addNewSubRaceToRace({
      raceId,
      subRaceDTO
    }))
  },
  removeSubRaceFromRace: (raceId: number, subRaceId: number) => {
    dispatch(removeSubRaceFromRace({
      raceId,
      subRaceId
    }))
  }
})


export function RaceAccordionBody(props: Readonly<IRaceAccordionBody>) {

  const { removeRace, addImageToRace, removeImageFromRace, updateRace, addNewSubRaceToRace, removeSubRaceFromRace } = actionDispatch(useAppDispatch());

  async function deleteRace(id: number): Promise<void> {
    return RaceControllerService.deleteRace(id)
      .then(() => removeRace(id))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const editRace = async (id: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      id: id,
      name: name,
      description: description
    }
    return RaceControllerService.updateRace(id, entryDTO)
      .then(() => {
        updateRace(id, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  async function saveImageToRace(acceptedFiles: Blob) {
    return RaceControllerService.saveImageToRace(props.race.object?.id!, { image: acceptedFiles })
      .then((res) => addImageToRace(res, props.race.object?.id!))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  async function deleteImageFromRace(raceId: number, imageId: number): Promise<void> {
    return RaceControllerService.deleteImageFromRace(raceId, imageId)
      .then(() => removeImageFromRace(imageId, raceId))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveNewSubRaceToRace = async (raceId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RaceSubRaceControllerService.addNewSubRaceRelation1(raceId, entryDTO)
      .then((result) => {
        addNewSubRaceToRace(raceId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingSubRaceToRace = async (raceId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: subRaceName,
      description: subRaceDescription,
      id: subRaceId
    }
    return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
      .then(() => {
        addNewSubRaceToRace(raceId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const getAllSubRaces = async () => {
    return await RaceSubRaceControllerService.getSubRacesWithoutRace()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeSubRaceFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
    return RaceSubRaceControllerService.removeSubRaceRelationRace(raceId, subRaceId)
      .then(() => {
        removeSubRaceFromRace(raceId, subRaceId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }


  return (
    <Accordion.Body>
      <FullEntryAccordionBody categoryName={"Race"} entryFullDTO={props.race}
        deleteEntry={deleteRace}
        updateEntry={editRace}
        saveImageToEntry={saveImageToRace}
        deleteImageFromEntry={deleteImageFromRace}
        subCategoryName={"Sub Race"} subCategoryLink={"subRaces"}
        fillTheListWithAllSubObjects={getAllSubRaces}
        addExistingObjectToRelation={saveExistingSubRaceToRace}
        deleteSubObject={removeSubRaceFromRaceFunction}
        addNewSubEntryToRelation={saveNewSubRaceToRace} />
    </Accordion.Body>
  )
}