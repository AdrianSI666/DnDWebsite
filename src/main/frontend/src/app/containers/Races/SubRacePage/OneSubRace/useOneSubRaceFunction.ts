
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO, SubRaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToSubRace, addRaceDescription, removeImageFromSubRace, removeRaceDescription, setSubRace, updateRaceDescription, updateSubRace } from "./store/oneSubRaceSlice"
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setSubRace: (subRace: EntryFullDTO) => {
        dispatch(setSubRace(subRace))
    },
    updateSubRace: (subRace: EntryDTO) => {
        dispatch(updateSubRace(subRace))
    },

    addNewStateSubRaceDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addRaceDescription(descriptionDTO))
    },
    updateStateSubRaceDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateRaceDescription({ descriptionId, descriptionDTO }))
    },
    removeStateSubRaceDescription: (descriptionId: number) => {
        dispatch(removeRaceDescription(descriptionId))
    },

    addImageToSubRace: (imageDTO: ImageDTO) => {
        dispatch(addImageToSubRace(imageDTO))
    },
    removeImageFromSubRace: (imageId: number) => {
        dispatch(removeImageFromSubRace(imageId))
    },
})

export function UseOneSubRaceObjectFunction() {
    const { setSubRace, addImageToSubRace, removeImageFromSubRace, updateSubRace, addNewStateSubRaceDescription, updateStateSubRaceDescription, removeStateSubRaceDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: updateStateSubRaceDescription })
    const navigate = useNavigate();
    const location = useLocation();
    const fetchSubRace = async (name: string): Promise<boolean> => {
        return SubRaceControllerService.getSubRaceByName(name)
            .then((response) => {
                setSubRace(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeSubRace = async (id: number) => {
        return SubRaceControllerService.deleteSubRace(id)
            .then((_) => {
                navigate("/SubRaces")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editSubRace = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return SubRaceControllerService.updateSubRace(id, entryDTO)
            .then((_) => {
                updateSubRace(entryDTO)
                if (location.pathname !== "/subraces/" + name) navigate('/subraces/' + name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToSubRace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return SubRaceControllerService.saveDescriptionToSubRace(id, descriptionDTO)
            .then((res) => addNewStateSubRaceDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateSubRaceDescription(raceId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(raceId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromSubRace(raceId: number, descriptionId: number) {
        return SubRaceControllerService.deleteDescriptionFromSubRace(raceId, descriptionId)
            .then((res) => removeStateSubRaceDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToSubRace = async (acceptedFiles: Blob, id: number) => {
        return SubRaceControllerService.saveImageToSubRace(id, { image: acceptedFiles })
            .then((res) => addImageToSubRace(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromSubRace = async (subRaceId: number, imageId: number) => {
        return SubRaceControllerService.deleteImageFromSubRace(subRaceId, imageId)
            .then(() => removeImageFromSubRace(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchSubRace, removeSubRace, editSubRace, saveImageToSubRace, deleteImageFromSubRace, addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace };
}