
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, RegionControllerService, EntryDTO, ImageDTO } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { addImageToRegion, removeRegion, removeImageFromRegion, updateRegion } from "../store/regionPageSlice";

interface IRegionFunction {
    regionId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeRegion: (id: number) => {
        dispatch(removeRegion(id))
    },
    updateRegion: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateRegion({ id, entryDTO }))
    },
    addImageToRegion: (imageDTO: ImageDTO, regionId: number) => {
        let payload = {
            regionId,
            imageDTO
        }
        dispatch(addImageToRegion(payload))
    },
    removeImageFromRegion: (imageId: number, regionId: number) => {
        dispatch(removeImageFromRegion({
            regionId,
            imageId
        }))
    },
})

export function RegionFunction(props: IRegionFunction) {
    const { removeRegion, addImageToRegion, removeImageFromRegion, updateRegion } = actionDispatch(useAppDispatch());
    async function deleteRegion(id: number): Promise<void> {
        return RegionControllerService.deleteRegion(id)
            .then(() => removeRegion(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRegion = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return RegionControllerService.updateRegion(id, entryDTO)
            .then(() => {
                updateRegion(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToRegion(acceptedFiles: Blob) {
        return RegionControllerService.saveImageToRegion(props.regionId!, { image: acceptedFiles })
            .then((res) => addImageToRegion(res, props.regionId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromRegion(regionId: number, imageId: number): Promise<void> {
        return RegionControllerService.deleteImageFromRegion(regionId, imageId)
            .then(() => removeImageFromRegion(imageId, regionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteRegion, editRegion, saveImageToRegion, deleteImageFromRegion };
}