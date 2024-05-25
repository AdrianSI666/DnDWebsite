
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, KingdomControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToKingdom, removeImageFromKingdom, setKingdom, updateKingdom } from "./store/oneKingdomSlice"

interface IUseOneKingdomObjectFunction {
    kingdomId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setKingdom: (kingdom: EntryFullDTO) => {
        dispatch(setKingdom(kingdom))
    },
    updateKingdom: (kingdom: EntryDTO) => {
        dispatch(updateKingdom(kingdom))
    },
    addImageToKingdom: (imageDTO: ImageDTO) => {
        dispatch(addImageToKingdom(imageDTO))
    },
    removeImageFromKingdom: (imageId: number) => {
        dispatch(removeImageFromKingdom(imageId))
    },
})

export function UseOneKingdomObjectFunction(props: IUseOneKingdomObjectFunction) {
    const { setKingdom, addImageToKingdom, removeImageFromKingdom, updateKingdom } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchKingdom = async (name: string): Promise<boolean> => {
        return KingdomControllerService.getKingdomByName(name)
            .then((response) => {
                setKingdom(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeKingdom = async (id: number) => {
        return KingdomControllerService.deleteKingdom(id)
            .then((_) => {
                navigate("/Kingdoms")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editKingdom = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return KingdomControllerService.updateKingdom(id, entryDTO)
            .then((_) => {
                updateKingdom(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToKingdom = async (acceptedFiles: Blob) => {
        return KingdomControllerService.saveImageToKingdom(props.kingdomId!, { image: acceptedFiles })
            .then((res) => addImageToKingdom(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromKingdom = async (kingdomId: number, imageId: number) => {
        return KingdomControllerService.deleteImageFromKingdom(kingdomId, imageId)
            .then(() => removeImageFromKingdom(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchKingdom, removeKingdom, editKingdom, saveImageToKingdom, deleteImageFromKingdom };
}