import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, RegionControllerService } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";

interface IRegionFunction {
    removeRegion?: (id: number) => void,

    updateRegion?: (id: number, entryDTO: EntryDTO) => void,
    updateOneRegion?: (entryDTO: EntryDTO) => void,

    addImageToRegion?: (imageDTO: ImageDTO, regionId: number) => void,
    addImageToOneRegion?: (imageDTO: ImageDTO) => void,

    removeImageFromRegion?: (imageId: number, regionId: number) => void,
    removeImageFromOneRegion?: (imageId: number) => void,

    addNewDescriptionRegion?: (regionId: number, descriptionDTO: DescriptionDTO) => void,
    addNewDescriptionOneRegion?: (descriptionDTO: DescriptionDTO) => void,

    updateStateRegionDescription?: (regionId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => void
    updateStateOneRegionDescription?: (descriptionId: number, descriptionDTO: DescriptionDTO) => void

    removeDescriptionFromRegion?: (regionId: number, descriptionId: number) => void,
    removeDescriptionFromOneRegion?: (descriptionId: number) => void,
}

export function RegionFunction(props: IRegionFunction) {    
    const navigate = useNavigate();
    const location = useLocation();
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

    const editRegion = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return RegionControllerService.updateRegion(id, entryDTO)
            .then(() => {
                if (props.updateRegion) props.updateRegion(id, entryDTO);
                else if (props.updateOneRegion) {
                    props.updateOneRegion(entryDTO);
                    if (location.pathname !== "/regions/" + name) navigate('/regions/' + name);
                }
                else throw new Error("Didn't sepcify dispatch action when editing region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToRegion(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return RegionControllerService.saveDescriptionToRegion(id, descriptionDTO)
            .then((res) => {
                if (props.addNewDescriptionRegion) props.addNewDescriptionRegion(id, descriptionDTO);
                else if (props.addNewDescriptionOneRegion) props.addNewDescriptionOneRegion(descriptionDTO);
                else throw new Error("Didn't sepcify dispatch action when adding new Description to Region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateRegionDescription(regionId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        if(props.updateStateRegionDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateDescription: props.updateStateRegionDescription })
            return updateDescription(regionId, descriptionId, descriptionDTO);
        } else if (props.updateStateOneRegionDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: props.updateStateOneRegionDescription })
            return updateDescription(regionId, descriptionId, descriptionDTO);
        } throw new Error("Didn't sepcify dispatch action when updating Description of Region.");
        
    }

    async function deleteDescriptionFromRegion(regionId: number, descriptionId: number) {
        return RegionControllerService.deleteDescriptionFromRegion(regionId, descriptionId)
            .then((_) => {
                if (props.removeDescriptionFromRegion) props.removeDescriptionFromRegion(regionId, descriptionId);
                else if (props.removeDescriptionFromOneRegion) props.removeDescriptionFromOneRegion(descriptionId);
                else throw new Error("Didn't sepcify dispatch action when removing Description from Region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }


    async function saveImageToRegion(acceptedFiles: Blob, id: number) {
        return RegionControllerService.saveImageToRegion(id, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToRegion) props.addImageToRegion(res, id);
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

    return {
        deleteRegion, editRegion,
        addNewDesctiptionToRegion, updateRegionDescription, deleteDescriptionFromRegion,
        saveImageToRegion, deleteImageFromRegion
    };
}