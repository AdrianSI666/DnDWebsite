
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, BeastControllerService, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addBeastDescription, addImageToBeast, removeBeastDescription, removeImageFromBeast, setBeast, updateBeast, updateBeastDescription } from "./store/oneBeastSlice"
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setBeast: (culture: EntryFullDTO) => {
        dispatch(setBeast(culture))
    },
    updateBeast: (culture: EntryDTO) => {
        dispatch(updateBeast(culture))
    },
    
    addNewStateBeastDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addBeastDescription(descriptionDTO))
    },
    updateStateBeastDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateBeastDescription({descriptionId, descriptionDTO}))
    },
    removeStateBeastDescription: (descriptionId: number) => {
        dispatch(removeBeastDescription(descriptionId))
    },

    addImageToBeast: (imageDTO: ImageDTO) => {
        dispatch(addImageToBeast(imageDTO))
    },
    removeImageFromBeast: (imageId: number) => {
        dispatch(removeImageFromBeast(imageId))
    },
})

export function UseOneBeastFunction() {
    const { setBeast, addImageToBeast, removeImageFromBeast, updateBeast, addNewStateBeastDescription, updateStateBeastDescription, removeStateBeastDescription } = actionDispatch(useAppDispatch());
    const {updateDescription} = GlobalDescriptionFunction({updateOneEntryDescription: updateStateBeastDescription})
    const navigate = useNavigate();
    const location = useLocation();
    const fetchBeast = async (name: string) :Promise<boolean> => {
        return BeastControllerService.getBeastByName(name)
            .then((response) => {
                setBeast(response);
                return true;
            })
            .catch((_) => {
                return false;
            });
    }

    const removeBeast = async (id: number) => {
        return BeastControllerService.deleteBeast(id)
            .then((_) => {
                navigate("/beasts")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editBeast = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return BeastControllerService.updateBeast(id, entryDTO)
            .then((_) => {
                updateBeast(entryDTO)
                if(location.pathname !== "/beasts/"+name) navigate('/beasts/'+name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToBeast(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return BeastControllerService.saveDescriptionToBeast(id, descriptionDTO)
            .then((res) => addNewStateBeastDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateBeastDescription(beastId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(beastId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromBeast(beastId: number, descriptionId: number) {
        return BeastControllerService.deleteDescriptionFromBeast(beastId, descriptionId)
            .then((res) => removeStateBeastDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToBeast = async (acceptedFiles: Blob, id: number) => {
        return BeastControllerService.saveImageToBeast(id, { image: acceptedFiles })
            .then((res) => addImageToBeast(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromBeast = async (beastId: number, imageId: number) => {
        return BeastControllerService.deleteImageFromBeast(beastId, imageId)
            .then(() => removeImageFromBeast(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchBeast, removeBeast, editBeast, addNewDesctiptionToBeast, updateBeastDescription, deleteDescriptionFromBeast, saveImageToBeast, deleteImageFromBeast };
}