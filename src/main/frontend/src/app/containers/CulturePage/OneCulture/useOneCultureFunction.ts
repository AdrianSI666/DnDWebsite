
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addImageToCulture, removeImageFromCulture, setCulture, updateCulture } from "./store/oneCultureSlice"

interface IUseOneCultureFunction {
    cultureId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setCulture: (culture: EntryFullDTO) => {
        dispatch(setCulture(culture))
    },
    updateCulture: (culture: EntryDTO) => {
        dispatch(updateCulture(culture))
    },
    addImageToCulture: (imageDTO: ImageDTO) => {
        dispatch(addImageToCulture(imageDTO))
    },
    removeImageFromCulture: (imageId: number) => {
        dispatch(removeImageFromCulture(imageId))
    },
})

export function UseOneCultureFunction(props: IUseOneCultureFunction) {
    const { setCulture, addImageToCulture, removeImageFromCulture, updateCulture } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchCulture = async (name: string) :Promise<boolean> => {
        return CultureControllerService.getCultureByName(name)
            .then((response) => {
                setCulture(response);
                return true;
            })
            .catch((_) => {
                return false;
            });
    }

    const removeCulture = async (id: number) => {
        return CultureControllerService.deleteCulture(id)
            .then((_) => {
                navigate("/cultures")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCulture = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return CultureControllerService.updateCulture(id, entryDTO)
            .then((_) => {
                updateCulture(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToCulture = async (acceptedFiles: Blob) => {
        return CultureControllerService.saveImageToCulture(props.cultureId!, { image: acceptedFiles })
            .then((res) => addImageToCulture(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromCulture = async (cultureId: number, imageId: number) => {
        return CultureControllerService.deleteImageFromCulture(cultureId, imageId)
            .then(() => removeImageFromCulture(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchCulture, removeCulture, editCulture, saveImageToCulture, deleteImageFromCulture };
}