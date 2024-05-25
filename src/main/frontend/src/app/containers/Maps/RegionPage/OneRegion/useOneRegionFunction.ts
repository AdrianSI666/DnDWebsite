
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, RegionControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher"

interface IUseOneRegionObjectFunction {
    regionId?: number
}

export function UseOneRegionFunction(props: IUseOneRegionObjectFunction) {
    const { setRegion, updateRegion, addImageToRegion, removeImageFromRegion } = OneRegionDispatcher();
    const navigate = useNavigate();
    const fetchRegion = async (name: string): Promise<boolean> => {
        return RegionControllerService.getRegionByName(name)
            .then((response) => {
                setRegion(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeRegion = async (id: number) => {
        return RegionControllerService.deleteRegion(id)
            .then((_) => {
                navigate("/Regions")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRegion = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return RegionControllerService.updateRegion(id, entryDTO)
            .then((_) => {
                updateRegion(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToRegion = async (acceptedFiles: Blob) => {
        return RegionControllerService.saveImageToRegion(props.regionId!, { image: acceptedFiles })
            .then((res) => addImageToRegion(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromRegion = async (regionId: number, imageId: number) => {
        return RegionControllerService.deleteImageFromRegion(regionId, imageId)
            .then(() => removeImageFromRegion(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchRegion, removeRegion, editRegion, saveImageToRegion, deleteImageFromRegion };
}