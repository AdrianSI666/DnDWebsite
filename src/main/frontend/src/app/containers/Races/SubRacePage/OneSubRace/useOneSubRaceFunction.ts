
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, SubRaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToSubRace, removeImageFromSubRace, setSubRace, updateSubRace } from "./store/oneSubRaceSlice"

interface IUseOneSubRaceObjectFunction {
    subRaceId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setSubRace: (subRace: EntryFullDTO) => {
        dispatch(setSubRace(subRace))
    },
    updateSubRace: (subRace: EntryDTO) => {
        dispatch(updateSubRace(subRace))
    },
    addImageToSubRace: (imageDTO: ImageDTO) => {
        dispatch(addImageToSubRace(imageDTO))
    },
    removeImageFromSubRace: (imageId: number) => {
        dispatch(removeImageFromSubRace(imageId))
    },
})

export function UseOneSubRaceObjectFunction(props: IUseOneSubRaceObjectFunction) {
    const { setSubRace, addImageToSubRace, removeImageFromSubRace, updateSubRace } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
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

    const editSubRace = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return SubRaceControllerService.updateSubRace(id, entryDTO)
            .then((_) => {
                updateSubRace(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToSubRace = async (acceptedFiles: Blob) => {
        return SubRaceControllerService.saveImageToSubRace(props.subRaceId!, { image: acceptedFiles })
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

    return { fetchSubRace, removeSubRace, editSubRace, saveImageToSubRace, deleteImageFromSubRace };
}