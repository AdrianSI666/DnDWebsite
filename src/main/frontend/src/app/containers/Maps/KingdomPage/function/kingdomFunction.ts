
import { ApiError, EntryDTO, ImageDTO, KingdomControllerService } from "../../../../../services/openapi";

interface IKingdomFunction {
    kingdomId?: number
    removeKingdom?: (id: number) => void

    updateKingdom?: (id: number, entryDTO: EntryDTO) => void
    updateOneKingdom?: (entryDTO: EntryDTO) => void

    addImageToKingdom?: (imageDTO: ImageDTO, regionId: number) => void
    addImageToOneKingdom?: (imageDTO: ImageDTO) => void

    removeImageFromKingdom?: (imageId: number, regionId: number) => void
    removeImageFromOneKingdom?: (imageId: number) => void
}

export function KingdomFunction(props: IKingdomFunction) {
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

    const editKingdom = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return KingdomControllerService.updateKingdom(id, entryDTO)
            .then(() => {
                if (props.updateKingdom) props.updateKingdom(id, entryDTO);
                else if (props.updateOneKingdom) props.updateOneKingdom(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when editing kingdom.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToKingdom(acceptedFiles: Blob) {
        return KingdomControllerService.saveImageToKingdom(props.kingdomId!, { image: acceptedFiles })
            .then((res) => {
                if (props.addImageToKingdom) props.addImageToKingdom(res, props.kingdomId!);
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

    return { deleteKingdom, editKingdom, saveImageToKingdom, deleteImageFromKingdom };
}