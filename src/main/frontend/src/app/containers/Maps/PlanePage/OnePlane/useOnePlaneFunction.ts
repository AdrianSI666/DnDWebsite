
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, PlaneControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToPlane, removeImageFromPlane, setPlane, updatePlane } from "./store/onePlaneSlice"

interface IUseOnePlaneObjectFunction {
    planeId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setPlane: (plane: EntryFullDTO) => {
        dispatch(setPlane(plane))
    },
    updatePlane: (plane: EntryDTO) => {
        dispatch(updatePlane(plane))
    },
    addImageToPlane: (imageDTO: ImageDTO) => {
        dispatch(addImageToPlane(imageDTO))
    },
    removeImageFromPlane: (imageId: number) => {
        dispatch(removeImageFromPlane(imageId))
    },
})

export function UseOnePlaneObjectFunction(props: IUseOnePlaneObjectFunction) {
    const { setPlane, addImageToPlane, removeImageFromPlane, updatePlane } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchPlane = async (name: string): Promise<boolean> => {
        return PlaneControllerService.getPlaneByName(name)
            .then((response) => {
                setPlane(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removePlane = async (id: number) => {
        return PlaneControllerService.deletePlane(id)
            .then((_) => {
                navigate("/Planes")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlane = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return PlaneControllerService.updatePlane(id, entryDTO)
            .then((_) => {
                updatePlane(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToPlane = async (acceptedFiles: Blob) => {
        return PlaneControllerService.saveImageToPlane(props.planeId!, { image: acceptedFiles })
            .then((res) => addImageToPlane(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromPlane = async (planeId: number, imageId: number) => {
        return PlaneControllerService.deleteImageFromPlane(planeId, imageId)
            .then(() => removeImageFromPlane(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchPlane, removePlane, editPlane, saveImageToPlane, deleteImageFromPlane };
}