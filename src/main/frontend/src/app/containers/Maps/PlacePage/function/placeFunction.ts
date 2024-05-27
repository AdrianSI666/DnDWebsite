
import { ApiError, EntryDTO, ImageDTO, PlaceControllerService } from "../../../../../services/openapi";

interface IPlaceFunction {
    placeId?: number
    removePlace?: (id: number) => void

    updatePlace?: (id: number, entryDTO: EntryDTO) => void
    updateOnePlace?: (entryDTO: EntryDTO) => void

    addImageToPlace?: (imageDTO: ImageDTO, placeId: number) => void
    addImageToOnePlace?: (imageDTO: ImageDTO) => void

    removeImageFromPlace?: (imageId: number, placeId: number) => void
    removeImageFromOnePlace?: (imageId: number) => void
}

export function PlaceFunction(props: IPlaceFunction) {
    async function deletePlace(id: number): Promise<void> {
        return PlaceControllerService.deletePlace(id)
            .then(() => {
                if (props.removePlace) props.removePlace(id);
                else throw new Error("Didn't sepcify dispatch action when removing place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlace = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return PlaceControllerService.updatePlace(id, entryDTO)
            .then(() => {
                if (props.updatePlace) props.updatePlace(id, entryDTO);
                else if (props.updateOnePlace) props.updateOnePlace(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when editing place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToPlace(acceptedFiles: Blob) {
        return PlaceControllerService.saveImageToPlace(props.placeId!, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToPlace) props.addImageToPlace(res, props.placeId!);
                else if (props.addImageToOnePlace) props.addImageToOnePlace(res);
                else throw new Error("Didn't sepcify dispatch action when saving image to region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromPlace(placeId: number, imageId: number): Promise<void> {
        return PlaceControllerService.deleteImageFromPlace(placeId, imageId)
            .then(() => {
                if (props.removeImageFromPlace) props.removeImageFromPlace(imageId, placeId);
                else if (props.removeImageFromOnePlace) props.removeImageFromOnePlace(imageId);
                else throw new Error("Didn't sepcify dispatch action when saving image to region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deletePlace, editPlace, saveImageToPlace, deleteImageFromPlace };
}