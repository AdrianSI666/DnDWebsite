import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, ImageDTO, RegionControllerService, RegionCultureControllerService } from "../../../services/openapi";
import '../../styles/masonary.css';
import { addImageToCulture, addNewRegionToCulture, removeCulture, removeImageFromCulture, removeRegionFromCulture, updateCulture } from "./store/culturePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import "../../styles/subObjects.css"
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";

interface ICultureAccordionBody {
  culture: EntryFullDTO
}

const actionDispatch = (dispatch: Dispatch) => ({
  removeCulture: (id: number) => {
    dispatch(removeCulture(id))
  },
  updateCulture: (id: number, entryDTO: EntryDTO) => {
    dispatch(updateCulture({ id, entryDTO }))
  },
  addImageToCulture: (imageDTO: ImageDTO, cultureId: number) => {
    let payload = {
      cultureId,
      imageDTO
    }
    dispatch(addImageToCulture(payload))
  },
  removeImageFromCulture: (imageId: number, cultureId: number) => {
    dispatch(removeImageFromCulture({
      cultureId,
      imageId
    }))
  },
  addNewRegionToCulture: (cultureId: number, regionDTO: EntryDTO) => {
    dispatch(addNewRegionToCulture({
      cultureId,
      regionDTO
    }))
  },
  removeRegionFromCulture: (cultureId: number, regionId: number) => {
    dispatch(removeRegionFromCulture({
      cultureId,
      regionId
    }))
  }
})


export function CultureAccordionBody(props: ICultureAccordionBody) {

  const { removeCulture, addImageToCulture, removeImageFromCulture, updateCulture, addNewRegionToCulture, removeRegionFromCulture } = actionDispatch(useAppDispatch());

  async function deleteCulture(id: number): Promise<void> {
    return CultureControllerService.deleteCulture(id)
      .then(() => removeCulture(id))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const editCulture = async (id: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      id: id,
      name: name,
      description: description
    }
    return CultureControllerService.updateCulture(id, entryDTO)
      .then(() => {
        updateCulture(id, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  function saveImageToCulture(acceptedFiles: Blob) {
    return CultureControllerService.saveImageToCulture(props.culture.object?.id!, { image: acceptedFiles })
      .then((res) => addImageToCulture(res, props.culture.object?.id!))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  async function deleteImageFromCulture(cultureId: number, imageId: number):Promise<void> {
    return CultureControllerService.deleteImageFromCulture(cultureId, imageId)
      .then(() => removeImageFromCulture(imageId, cultureId))
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveNewRegionToCulture = async (cultureId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RegionCultureControllerService.addNewRegionCultureRegion(cultureId, entryDTO)
      .then((result) => {
        addNewRegionToCulture(cultureId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      description: regionDescription,
      id: regionId
    }
    return RegionCultureControllerService.addCultureRegionRelation(regionId, cultureId)
      .then(() => {
        addNewRegionToCulture(cultureId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const getAllRegions = async () => {
    return await RegionControllerService.getAllRegions()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
    return RegionCultureControllerService.deleteCulture(regionId, cultureId)
      .then(() => {
        removeRegionFromCulture(cultureId, regionId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }


  return (
    <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={props.culture} 
    deleteEntry={deleteCulture} 
    updateEntry={editCulture} 
    saveImageToEntry={saveImageToCulture}
    deleteImageFromEntry={deleteImageFromCulture}
    subCategoryName={"region"} subCategoryLink={"regions"} 
    fillTheListWithAllSubObjects={getAllRegions}
    addExistingObjectToRelation={saveExistingRegionToCulture}
    deleteSubObject={removeRegionFromCultureFunction}
    addNewSubEntryToRelation={saveNewRegionToCulture} />
  )
}