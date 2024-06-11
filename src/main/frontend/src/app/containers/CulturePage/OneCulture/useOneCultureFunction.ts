
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, CultureControllerService, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addCultureDescription, addImageToCulture, removeCultureDescription, removeImageFromCulture, setCulture, updateCulture, updateCultureDescription } from "./store/oneCultureSlice"
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setCulture: (culture: EntryFullDTO) => {
        dispatch(setCulture(culture))
    },
    updateCulture: (culture: EntryDTO) => {
        dispatch(updateCulture(culture))
    },
    
    addNewStateCultureDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addCultureDescription(descriptionDTO))
    },
    updateStateCultureDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateCultureDescription({descriptionId, descriptionDTO}))
    },
    removeStateCultureDescription: (descriptionId: number) => {
        dispatch(removeCultureDescription(descriptionId))
    },

    addImageToCulture: (imageDTO: ImageDTO) => {
        dispatch(addImageToCulture(imageDTO))
    },
    removeImageFromCulture: (imageId: number) => {
        dispatch(removeImageFromCulture(imageId))
    },
})

export function UseOneCultureFunction() {
    const { setCulture, addImageToCulture, removeImageFromCulture, updateCulture, addNewStateCultureDescription, updateStateCultureDescription, removeStateCultureDescription } = actionDispatch(useAppDispatch());
    const {updateDescription} = GlobalDescriptionFunction({updateOneEntryDescription: updateStateCultureDescription})
    const navigate = useNavigate();
    const location = useLocation();
    const fetchCulture = async (name: string) :Promise<boolean> => {
        return CultureControllerService.getCultureByName(name)
            .then((response) => {
                setCulture(response);
                return true;
            })
            .catch((_) => {
                return false;
            });
    }

    const removeCulture = async (id: number) => {
        return CultureControllerService.deleteCulture(id)
            .then((_) => {
                navigate("/cultures")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCulture = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return CultureControllerService.updateCulture(id, entryDTO)
            .then((_) => {
                updateCulture(entryDTO)
                if(location.pathname !== "/cultures/"+name) navigate('/cultures/'+name);
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToCulture(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return CultureControllerService.saveDescriptionToCulture(id, descriptionDTO)
            .then((res) => addNewStateCultureDescription(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateCultureDescription(cultureId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(cultureId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromCulture(cultureId: number, descriptionId: number) {
        return CultureControllerService.deleteDescriptionFromCulture(cultureId, descriptionId)
            .then((res) => removeStateCultureDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToCulture = async (acceptedFiles: Blob, id: number) => {
        return CultureControllerService.saveImageToCulture(id, { image: acceptedFiles })
            .then((res) => addImageToCulture(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromCulture = async (cultureId: number, imageId: number) => {
        return CultureControllerService.deleteImageFromCulture(cultureId, imageId)
            .then(() => removeImageFromCulture(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchCulture, removeCulture, editCulture, addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture, saveImageToCulture, deleteImageFromCulture };
}