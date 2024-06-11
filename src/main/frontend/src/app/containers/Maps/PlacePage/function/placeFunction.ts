
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, PlaceControllerService } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";

interface IPlaceFunction {
    removePlace?: (id: number) => void

    updatePlace?: (id: number, entryDTO: EntryDTO) => void
    updateOnePlace?: (entryDTO: EntryDTO) => void

    addImageToPlace?: (imageDTO: ImageDTO, placeId: number) => void
    addImageToOnePlace?: (imageDTO: ImageDTO) => void

    removeImageFromPlace?: (imageId: number, placeId: number) => void
    removeImageFromOnePlace?: (imageId: number) => void

    addNewDescriptionPlace?: (placeId: number, descriptionDTO: DescriptionDTO) => void,
    addNewDescriptionOnePlace?: (descriptionDTO: DescriptionDTO) => void,

    updateStatePlaceDescription?: (placeId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => void
    updateStateOnePlaceDescription?: (descriptionId: number, descriptionDTO: DescriptionDTO) => void

    removeDescriptionFromPlace?: (placeId: number, descriptionId: number) => void,
    removeDescriptionFromOnePlace?: (descriptionId: number) => void,
}

export function PlaceFunction(props: IPlaceFunction) {
    const navigate = useNavigate();
    const location = useLocation();
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

    const editPlace = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return PlaceControllerService.updatePlace(id, entryDTO)
            .then(() => {
                if (props.updatePlace) props.updatePlace(id, entryDTO);
                else if (props.updateOnePlace) {
                    props.updateOnePlace(entryDTO);
                    if (location.pathname !== "/places/" + name) navigate('/places/' + name);
                }
                else throw new Error("Didn't sepcify dispatch action when editing place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToPlace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return PlaceControllerService.saveDescriptionToPlace(id, descriptionDTO)
            .then((res) => {
                if (props.addNewDescriptionPlace) props.addNewDescriptionPlace(id, descriptionDTO);
                else if (props.addNewDescriptionOnePlace) props.addNewDescriptionOnePlace(descriptionDTO);
                else throw new Error("Didn't sepcify dispatch action when adding new Description to Place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updatePlaceDescription(placeId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        if(props.updateStatePlaceDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateDescription: props.updateStatePlaceDescription })
            return updateDescription(placeId, descriptionId, descriptionDTO);
        } else if (props.updateStateOnePlaceDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: props.updateStateOnePlaceDescription })
            return updateDescription(placeId, descriptionId, descriptionDTO);
        } throw new Error("Didn't sepcify dispatch action when updating Description of Place.");
        
    }

    async function deleteDescriptionFromPlace(placeId: number, descriptionId: number) {
        return PlaceControllerService.deleteDescriptionFromPlace(placeId, descriptionId)
            .then((_) => {
                if (props.removeDescriptionFromPlace) props.removeDescriptionFromPlace(placeId, descriptionId);
                else if (props.removeDescriptionFromOnePlace) props.removeDescriptionFromOnePlace(descriptionId);
                else throw new Error("Didn't sepcify dispatch action when removing Description from Place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToPlace(acceptedFiles: Blob, id: number) {
        return PlaceControllerService.saveImageToPlace(id, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToPlace) props.addImageToPlace(res, id);
                else if (props.addImageToOnePlace) props.addImageToOnePlace(res);
                else throw new Error("Didn't sepcify dispatch action when saving image to place.");
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
                else throw new Error("Didn't sepcify dispatch action when deleting image to place.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deletePlace, editPlace,
        addNewDesctiptionToPlace, deleteDescriptionFromPlace, updatePlaceDescription,
        saveImageToPlace, deleteImageFromPlace };
}