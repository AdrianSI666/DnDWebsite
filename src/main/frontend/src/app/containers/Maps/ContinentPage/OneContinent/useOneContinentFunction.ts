
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, ContinentControllerService, DescriptionDTO } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addContinentDescription, addImageToContinent, removeContinentDescription, removeImageFromContinent, setContinent, updateContinent, updateContinentDescription } from "./store/oneContinentSlice"
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setContinent: (continent: EntryFullDTO) => {
        dispatch(setContinent(continent))
    },
    updateContinent: (continent: EntryDTO) => {
        dispatch(updateContinent(continent))
    },

    addNewStateContinentDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addContinentDescription(descriptionDTO))
    },
    updateStateContinentDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateContinentDescription({ descriptionId, descriptionDTO }))
    },
    removeStateContinentDescription: (descriptionId: number) => {
        dispatch(removeContinentDescription(descriptionId))
    },

    addImageToContinent: (imageDTO: ImageDTO) => {
        dispatch(addImageToContinent(imageDTO))
    },
    removeImageFromContinent: (imageId: number) => {
        dispatch(removeImageFromContinent(imageId))
    },
})

export function UseOneContinentObjectFunction() {
    const { setContinent, addImageToContinent, removeImageFromContinent, updateContinent, addNewStateContinentDescription, updateStateContinentDescription, removeStateContinentDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: updateStateContinentDescription })
    const navigate = useNavigate();
    const location = useLocation();
    const fetchContinent = async (name: string): Promise<boolean> => {
        return ContinentControllerService.getContinentByName(name)
            .then((response) => {
                setContinent(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeContinent = async (id: number) => {
        return ContinentControllerService.deleteContinent(id)
            .then((_) => {
                navigate("/Continents")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinent = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return ContinentControllerService.updateContinent(id, entryDTO)
            .then((_) => {
                updateContinent(entryDTO)
                if (location.pathname !== "/continents/" + name) navigate('/continents/' + name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToContinent(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return ContinentControllerService.saveDescriptionToContinent(id, descriptionDTO)
            .then((res) => addNewStateContinentDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateContinentDescription(worldId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(worldId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromContinent(worldId: number, descriptionId: number) {
        return ContinentControllerService.deleteDescriptionFromContinent(worldId, descriptionId)
            .then((res) => removeStateContinentDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToContinent = async (acceptedFiles: Blob, id: number) => {
        return ContinentControllerService.saveImageToContinent(id, { image: acceptedFiles })
            .then((res) => addImageToContinent(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromContinent = async (continentId: number, imageId: number) => {
        return ContinentControllerService.deleteImageFromContinent(continentId, imageId)
            .then(() => removeImageFromContinent(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return {
        fetchContinent, removeContinent, editContinent,
        addNewDesctiptionToContinent, deleteDescriptionFromContinent, updateContinentDescription,
        saveImageToContinent, deleteImageFromContinent
    };
}