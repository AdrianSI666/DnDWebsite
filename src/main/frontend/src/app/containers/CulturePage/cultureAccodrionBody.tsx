import { Accordion, Form } from "react-bootstrap";
import { CultureControllerService, EntryDTO, EntryFullDTO, ImageDTO, RegionControllerService, RegionCultureControllerService } from "../../../services/openapi";
import Dropzone from "../../components/Dropzone";
import Masonry from "react-masonry-css";
import '../../styles/masonary.css';
import { addImageToCulture, addNewRegionToCulture, removeCulture, removeImageFromCulture, removeRegionFromCulture, updateCulture } from "./store/culturePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import { CultureEditModal } from "../../components/modals/cultureEditModal";
import { DeleteConfirmationModal } from "../../components/modals/deleteConfirmModal";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { AddFromListModal } from "../../components/modals/addFromListModal";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import "../../styles/subObjects.css"
import toast from "react-hot-toast";

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

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};


export function CultureAccordionBody(props: ICultureAccordionBody) {

  const { removeCulture, addImageToCulture, removeImageFromCulture, updateCulture, addNewRegionToCulture, removeRegionFromCulture } = actionDispatch(useAppDispatch());

  async function deleteCulture(id: number): Promise<void> {
    return CultureControllerService.deleteCulture(id)
      .then(() => removeCulture(id))
      .catch(err => console.log(err))
  }

  function saveImageToCulture(acceptedFiles: Blob) {
    toast.promise(
    CultureControllerService.saveImageToCulture(props.culture.object?.id!, { image: acceptedFiles })
      .then((res) => addImageToCulture(res, props.culture.object?.id!))
      .catch(err => console.log(err))
      , {
        loading: 'Saving...',
        success: `Sucesfully added image.`,
        error: (err) => `Operation failed.\n ${err}`,
      });
  }

  async function deleteImageFromCulture(cultureId: number, imageId: number):Promise<void> {
    toast.promise(
    CultureControllerService.deleteImageFromCulture(cultureId, imageId)
      .then(() => removeImageFromCulture(imageId, cultureId))
      .catch(err => console.log(err))
      , {
        loading: 'Saving...',
        success: `Sucesfully added image.`,
        error: (err) => `Operation failed.\n ${err}`,
      });
  }

  const editCulture = async (id: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      id: id,
      name: name,
      description: description
    }
    CultureControllerService.updateCulture(id, entryDTO)
      .then(() => {
        updateCulture(id, entryDTO);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewRegionToCulture = async (cultureId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    RegionCultureControllerService.addNewRegionCultureRegion(cultureId, entryDTO)
      .then((result) => {
        addNewRegionToCulture(cultureId, result);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      description: regionDescription,
      id: regionId
    }
    RegionCultureControllerService.addCultureRegionRelation(regionId, cultureId)
      .then(() => {
        addNewRegionToCulture(cultureId, entryDTO);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const getAllRegions = async () => {
    return await RegionControllerService.getAllRegions()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeRegionFromCultureFunction = async (cultureId: number, regionId: number) => {
    RegionCultureControllerService.deleteCulture(regionId, cultureId)
      .then(() => {
        removeRegionFromCulture(cultureId, regionId);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }


  return (
    <Accordion.Body>
      <DeleteConfirmationModal deleteFunction={deleteCulture} categoryName="Culture" title={props.culture.object?.name!} id={props.culture.object?.id!} />
      <Form.Control as="textarea" rows={12} readOnly value={props.culture.object?.description} />
      <CultureEditModal updateFunction={editCulture} id={props.culture.object?.id!} name={props.culture.object?.name!} description={props.culture.object?.description!} />
      <h3>Images</h3>
      <Dropzone onDrop={(acceptedFiles: Blob) => saveImageToCulture(acceptedFiles)} />
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {props.culture.images!.map(oneimage => {
          const imageSrc = "data:image/jpg;base64," + oneimage.content
          const imageName = oneimage.name
          return (
            <div key={oneimage.id}>
              <h3>{imageName}</h3>
              <img src={imageSrc} className="img-fluid" width="300px" alt={imageName} />
              <DeleteConfirmationModal deleteFunctionInRelation={deleteImageFromCulture} categoryName="Image" title={oneimage.name!} id={props.culture.object?.id!} secondId={oneimage.id!} />
            </div>)
        })}
      </Masonry>

      <h3>Regions</h3>
      <AddNewEntryModal categoryName="new world Region that uses this culture" addFunctionToRelation={saveNewRegionToCulture} id={props.culture.object?.id!} />
      <AddFromListModal categoryName="Region from the list" fillTheListWithObjects={getAllRegions} addExistingObjectToRelation={saveExistingRegionToCulture} id={props.culture.object?.id!} />

      <List className="p-1">
        {props.culture.subObjects!.map(subObject => {
          return (
            <div className="w-100 p-3 btn btn-outline-info" key={subObject.id}>
              <ListItem
                key={subObject.id}
                disableGutters
                secondaryAction={
                  <DeleteConfirmationModal deleteFunctionInRelation={removeRegionFromCultureFunction} categoryName="Region" title={subObject.name!} id={props.culture.object?.id!} secondId={subObject.id!} />
                }
              >
                <ListItemText primary={subObject.name} secondary={
                  <Link className="btn btn-outline-warning" to={`/region/${subObject.name}`} state={props}>Go to this region</Link>
                } />
              </ListItem>
            </div>)
        })}
      </List>
    </Accordion.Body>
  )
}