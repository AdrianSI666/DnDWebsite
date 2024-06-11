
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO, RaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToRace, addRaceDescription, removeImageFromRace, removeRaceDescription, setRace, updateRace, updateRaceDescription } from "./store/oneRaceSlice"
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setRace: (race: EntryFullDTO) => {
        dispatch(setRace(race))
    },
    updateRace: (race: EntryDTO) => {
        dispatch(updateRace(race))
    },

    addNewStateRaceDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addRaceDescription(descriptionDTO))
    },
    updateStateRaceDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateRaceDescription({ descriptionId, descriptionDTO }))
    },
    removeStateRaceDescription: (descriptionId: number) => {
        dispatch(removeRaceDescription(descriptionId))
    },

    addImageToRace: (imageDTO: ImageDTO) => {
        dispatch(addImageToRace(imageDTO))
    },
    removeImageFromRace: (imageId: number) => {
        dispatch(removeImageFromRace(imageId))
    },
})

export function UseOneRaceObjectFunction() {
    const { setRace, addImageToRace, removeImageFromRace, updateRace, addNewStateRaceDescription, removeStateRaceDescription, updateStateRaceDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: updateStateRaceDescription })
    const navigate = useNavigate();
    const location = useLocation();
    const fetchRace = async (name: string): Promise<boolean> => {
        return RaceControllerService.getRaceByName(name)
            .then((response) => {
                setRace(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeRace = async (id: number) => {
        return RaceControllerService.deleteRace(id)
            .then((_) => {
                navigate("/Races")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRace = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return RaceControllerService.updateRace(id, entryDTO)
            .then((_) => {
                updateRace(entryDTO)
                if (location.pathname !== "/races/" + name) navigate('/races/' + name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToRace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return RaceControllerService.saveDescriptionToRace(id, descriptionDTO)
            .then((res) => addNewStateRaceDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateRaceDescription(raceId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(raceId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromRace(raceId: number, descriptionId: number) {
        return RaceControllerService.deleteDescriptionFromRace(raceId, descriptionId)
            .then((res) => removeStateRaceDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }


    const saveImageToRace = async (acceptedFiles: Blob, id: number) => {
        return RaceControllerService.saveImageToRace(id, { image: acceptedFiles })
            .then((res) => addImageToRace(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromRace = async (raceId: number, imageId: number) => {
        return RaceControllerService.deleteImageFromRace(raceId, imageId)
            .then(() => removeImageFromRace(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return {
        fetchRace, removeRace, editRace,
        addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace,
        saveImageToRace, deleteImageFromRace
    };
}