
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, RaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToRace, removeImageFromRace, setRace, updateRace } from "./store/oneRaceSlice"

interface IUseOneRaceObjectFunction {
    raceId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setRace: (race: EntryFullDTO) => {
        dispatch(setRace(race))
    },
    updateRace: (race: EntryDTO) => {
        dispatch(updateRace(race))
    },
    addImageToRace: (imageDTO: ImageDTO) => {
        dispatch(addImageToRace(imageDTO))
    },
    removeImageFromRace: (imageId: number) => {
        dispatch(removeImageFromRace(imageId))
    },
})

export function UseOneRaceObjectFunction(props: IUseOneRaceObjectFunction) {
    const { setRace, addImageToRace, removeImageFromRace, updateRace } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
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

    const editRace = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return RaceControllerService.updateRace(id, entryDTO)
            .then((_) => {
                updateRace(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToRace = async (acceptedFiles: Blob) => {
        return RaceControllerService.saveImageToRace(props.raceId!, { image: acceptedFiles })
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

    return { fetchRace, removeRace, editRace, saveImageToRace, deleteImageFromRace };
}