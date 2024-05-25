
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, PlaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToPlace, removeImageFromPlace, setPlace, updatePlace } from "./store/onePlaceSlice"

interface IUseOnePlaceObjectFunction {
    placeId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setPlace: (place: EntryFullDTO) => {
        dispatch(setPlace(place))
    },
    updatePlace: (place: EntryDTO) => {
        dispatch(updatePlace(place))
    },
    addImageToPlace: (imageDTO: ImageDTO) => {
        dispatch(addImageToPlace(imageDTO))
    },
    removeImageFromPlace: (imageId: number) => {
        dispatch(removeImageFromPlace(imageId))
    },
})

export function UseOnePlaceObjectFunction(props: IUseOnePlaceObjectFunction) {
    const { setPlace, addImageToPlace, removeImageFromPlace, updatePlace } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchPlace = async (name: string): Promise<boolean> => {
        return PlaceControllerService.getPlaceByName(name)
            .then((response) => {
                setPlace(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removePlace = async (id: number) => {
        return PlaceControllerService.deletePlace(id)
            .then((_) => {
                navigate("/Places")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlace = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return PlaceControllerService.updatePlace(id, entryDTO)
            .then((_) => {
                updatePlace(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToPlace = async (acceptedFiles: Blob) => {
        return PlaceControllerService.saveImageToPlace(props.placeId!, { image: acceptedFiles })
            .then((res) => addImageToPlace(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromPlace = async (placeId: number, imageId: number) => {
        return PlaceControllerService.deleteImageFromPlace(placeId, imageId)
            .then(() => removeImageFromPlace(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchPlace, removePlace, editPlace, saveImageToPlace, deleteImageFromPlace };
}