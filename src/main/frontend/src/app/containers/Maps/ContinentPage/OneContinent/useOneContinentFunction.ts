
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, ContinentControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToContinent, removeImageFromContinent, setContinent, updateContinent } from "./store/oneContinentSlice"

interface IUseOneContinentObjectFunction {
    continentId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setContinent: (continent: EntryFullDTO) => {
        dispatch(setContinent(continent))
    },
    updateContinent: (continent: EntryDTO) => {
        dispatch(updateContinent(continent))
    },
    addImageToContinent: (imageDTO: ImageDTO) => {
        dispatch(addImageToContinent(imageDTO))
    },
    removeImageFromContinent: (imageId: number) => {
        dispatch(removeImageFromContinent(imageId))
    },
})

export function UseOneContinentObjectFunction(props: IUseOneContinentObjectFunction) {
    const { setContinent, addImageToContinent, removeImageFromContinent, updateContinent } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchContinent = async (name: string): Promise<boolean> => {
        return ContinentControllerService.getContinentByName(name)
            .then((response) => {
                setContinent(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeContinent = async (id: number) => {
        return ContinentControllerService.deleteContinent(id)
            .then((_) => {
                navigate("/Continents")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinent = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return ContinentControllerService.updateContinent(id, entryDTO)
            .then((_) => {
                updateContinent(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToContinent = async (acceptedFiles: Blob) => {
        return ContinentControllerService.saveImageToContinent(props.continentId!, { image: acceptedFiles })
            .then((res) => addImageToContinent(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromContinent = async (continentId: number, imageId: number) => {
        return ContinentControllerService.deleteImageFromContinent(continentId, imageId)
            .then(() => removeImageFromContinent(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchContinent, removeContinent, editContinent, saveImageToContinent, deleteImageFromContinent };
}