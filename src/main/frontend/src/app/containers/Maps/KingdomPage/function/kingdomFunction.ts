
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, KingdomControllerService } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";

interface IKingdomFunction {
    removeKingdom?: (id: number) => void

    updateKingdom?: (id: number, entryDTO: EntryDTO) => void
    updateOneKingdom?: (entryDTO: EntryDTO) => void

    addImageToKingdom?: (imageDTO: ImageDTO, regionId: number) => void
    addImageToOneKingdom?: (imageDTO: ImageDTO) => void

    removeImageFromKingdom?: (imageId: number, regionId: number) => void
    removeImageFromOneKingdom?: (imageId: number) => void

    addNewDescriptionKingdom?: (kingdomId: number, descriptionDTO: DescriptionDTO) => void,
    addNewDescriptionOneKingdom?: (descriptionDTO: DescriptionDTO) => void,

    updateStateKingdomDescription?: (kingdomId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => void
    updateStateOneKingdomDescription?: (descriptionId: number, descriptionDTO: DescriptionDTO) => void

    removeDescriptionFromKingdom?: (kingdomId: number, descriptionId: number) => void,
    removeDescriptionFromOneKingdom?: (descriptionId: number) => void,
}

export function KingdomFunction(props: IKingdomFunction) {
    const navigate = useNavigate();
    const location = useLocation();
    async function deleteKingdom(id: number): Promise<void> {
        return KingdomControllerService.deleteKingdom(id)
            .then(() => {
                if (props.removeKingdom) props.removeKingdom(id);
                else throw new Error("Didn't sepcify dispatch action when removing region.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editKingdom = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return KingdomControllerService.updateKingdom(id, entryDTO)
            .then(() => {
                if (props.updateKingdom) props.updateKingdom(id, entryDTO);
                else if (props.updateOneKingdom) {
                    props.updateOneKingdom(entryDTO);
                    if (location.pathname !== "/kingdoms/" + name) navigate('/kingdoms/' + name);
                }
                else throw new Error("Didn't sepcify dispatch action when editing kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToKingdom(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return KingdomControllerService.saveDescriptionToKingdom(id, descriptionDTO)
            .then((res) => {
                if (props.addNewDescriptionKingdom) props.addNewDescriptionKingdom(id, descriptionDTO);
                else if (props.addNewDescriptionOneKingdom) props.addNewDescriptionOneKingdom(descriptionDTO);
                else throw new Error("Didn't sepcify dispatch action when adding new Description to Kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateKingdomDescription(kingdomId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        if(props.updateStateKingdomDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateDescription: props.updateStateKingdomDescription })
            return updateDescription(kingdomId, descriptionId, descriptionDTO);
        } else if (props.updateStateOneKingdomDescription) {
            let { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: props.updateStateOneKingdomDescription })
            return updateDescription(kingdomId, descriptionId, descriptionDTO);
        } throw new Error("Didn't sepcify dispatch action when updating Description of Kingdom.");
        
    }

    async function deleteDescriptionFromKingdom(kingdomId: number, descriptionId: number) {
        return KingdomControllerService.deleteDescriptionFromKingdom(kingdomId, descriptionId)
            .then((_) => {
                if (props.removeDescriptionFromKingdom) props.removeDescriptionFromKingdom(kingdomId, descriptionId);
                else if (props.removeDescriptionFromOneKingdom) props.removeDescriptionFromOneKingdom(descriptionId);
                else throw new Error("Didn't sepcify dispatch action when removing Description from Kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToKingdom(acceptedFiles: Blob, id: number) {
        return KingdomControllerService.saveImageToKingdom(id, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToKingdom) props.addImageToKingdom(res, id);
                else if (props.addImageToOneKingdom) props.addImageToOneKingdom(res);
                else throw new Error("Didn't sepcify dispatch action when saving image to kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromKingdom(kingdomId: number, imageId: number): Promise<void> {
        return KingdomControllerService.deleteImageFromKingdom(kingdomId, imageId)
            .then(() => {
                if (props.removeImageFromKingdom) props.removeImageFromKingdom(imageId, kingdomId);
                else if (props.removeImageFromOneKingdom) props.removeImageFromOneKingdom(imageId);
                else throw new Error("Didn't sepcify dispatch action when saving image to kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteKingdom, editKingdom,
        addNewDesctiptionToKingdom, deleteDescriptionFromKingdom, updateKingdomDescription,
        saveImageToKingdom, deleteImageFromKingdom };
}