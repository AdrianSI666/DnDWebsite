import { ApiError, EntryDTO, ImageDTO, RegionControllerService } from "../../../../../services/openapi";

interface IRegionFunction {
    regionId?: number
    removeRegion?: (id: number) => void

    updateRegion?: (id: number, entryDTO: EntryDTO) => void
    updateOneRegion?: (entryDTO: EntryDTO) => void

    addImageToRegion?: (imageDTO: ImageDTO, regionId: number) => void
    addImageToOneRegion?: (imageDTO: ImageDTO) => void

    removeImageFromRegion?: (imageId: number, regionId: number) => void
    removeImageFromOneRegion?: (imageId: number) => void
}

export function RegionFunction(props: IRegionFunction) {
    async function deleteRegion(id: number): Promise<void> {
        return RegionControllerService.deleteRegion(id)
            .then(() => {
                if (props.removeRegion) props.removeRegion(id);
                else throw new Error("Didn't sepcify dispatch action when removing region.");
            }).catch((err: ApiError) => {
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
                if (props.updateRegion) props.updateRegion(id, entryDTO);
                else if (props.updateOneRegion) props.updateOneRegion(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when editing region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToRegion(acceptedFiles: Blob) {
        return RegionControllerService.saveImageToRegion(props.regionId!, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToRegion) props.addImageToRegion(res, props.regionId!);
                else if (props.addImageToOneRegion) props.addImageToOneRegion(res);
                else throw new Error("Didn't sepcify dispatch action when saving image to region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromRegion(regionId: number, imageId: number): Promise<void> {
        return RegionControllerService.deleteImageFromRegion(regionId, imageId)
            .then(() => {
                if (props.removeImageFromRegion) props.removeImageFromRegion(imageId, regionId);
                else if (props.removeImageFromOneRegion) props.removeImageFromOneRegion(imageId);
                else throw new Error("Didn't sepcify dispatch action when saving image to region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteRegion, editRegion, saveImageToRegion, deleteImageFromRegion };
}