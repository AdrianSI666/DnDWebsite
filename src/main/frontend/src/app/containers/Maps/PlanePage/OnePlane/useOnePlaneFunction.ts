
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO, PlaneControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToPlane, addPlaneDescription, removeImageFromPlane, removePlaneDescription, setPlane, updatePlane, updatePlaneDescription } from "./store/onePlaneSlice"
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setPlane: (plane: EntryFullDTO) => {
        dispatch(setPlane(plane))
    },
    updatePlane: (plane: EntryDTO) => {
        dispatch(updatePlane(plane))
    },

    addNewStatePlaneDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addPlaneDescription(descriptionDTO))
    },
    updateStatePlaneDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updatePlaneDescription({ descriptionId, descriptionDTO }))
    },
    removeStatePlaneDescription: (descriptionId: number) => {
        dispatch(removePlaneDescription(descriptionId))
    },

    addImageToPlane: (imageDTO: ImageDTO) => {
        dispatch(addImageToPlane(imageDTO))
    },
    removeImageFromPlane: (imageId: number) => {
        dispatch(removeImageFromPlane(imageId))
    },
})

export function UseOnePlaneObjectFunction() {
    const { setPlane, addImageToPlane, removeImageFromPlane, updatePlane, addNewStatePlaneDescription, updateStatePlaneDescription, removeStatePlaneDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: updateStatePlaneDescription })
    const navigate = useNavigate();
    const location = useLocation();
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

    const editPlane = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return PlaneControllerService.updatePlane(id, entryDTO)
            .then((_) => {
                updatePlane(entryDTO)
                if (location.pathname !== "/planes/" + name) navigate('/planes/' + name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToPlane(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return PlaneControllerService.saveDescriptionToPlane(id, descriptionDTO)
            .then((res) => addNewStatePlaneDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updatePlaneDescription(worldId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(worldId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromPlane(worldId: number, descriptionId: number) {
        return PlaneControllerService.deleteDescriptionFromPlane(worldId, descriptionId)
            .then((res) => removeStatePlaneDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToPlane = async (acceptedFiles: Blob, id: number) => {
        return PlaneControllerService.saveImageToPlane(id, { image: acceptedFiles })
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

    return { fetchPlane, removePlane, editPlane,
        addNewDesctiptionToPlane, deleteDescriptionFromPlane, updatePlaneDescription,
        saveImageToPlane, deleteImageFromPlane };
}