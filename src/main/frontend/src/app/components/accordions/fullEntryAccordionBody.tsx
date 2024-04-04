import { Form } from "react-bootstrap";
import { EntryDTO, EntryFullDTO } from "../../../services/openapi";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EntryEditModal } from "../modals/entryEditModal";
import Dropzone from "../Dropzone";
import Masonry from "react-masonry-css";
import { AddNewEntryModal } from "../modals/addNewEntryModal";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { AddFromListModal } from "../modals/addFromListModal";
import toast from "react-hot-toast";

interface IFullEntryAccordionBody {
    categoryName: string;
    entryFullDTO: EntryFullDTO,
    deleteEntry: (id: number) => Promise<void>;
    updateEntry: (id: number, name: string, description: string) => Promise<void>,

    saveImageToEntry: (acceptedFiles: Blob) => Promise<void>;
    deleteImageFromEntry: (entryId: number, imageId: number) => Promise<void>;

    subCategoryName: string;
    subCategoryLink: string;
    fillTheListWithAllSubObjects: () => Promise<void | EntryDTO[]>;
    addNewSubEntryToRelation: (id: number, name: string, description: string) => Promise<void>;
    addExistingObjectToRelation: (coreObjectId: number, objectToAddId: number, objectName: string, objectDescription: string) => Promise<void>;
    deleteSubObject: (id: number, secondId: number) => Promise<void>;
    
}

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

export function FullEntryAccordionBody(props: Readonly<IFullEntryAccordionBody>) {
    return (
        <>
            <DeleteConfirmationModal deleteObject={props.deleteEntry} categoryName={props.categoryName} title={props.entryFullDTO.object?.name!} id={props.entryFullDTO.object?.id!} />
            <Form.Control as="textarea" rows={12} readOnly value={props.entryFullDTO.object?.description} />
            <EntryEditModal updateFunction={props.updateEntry} categoryName={props.categoryName} id={props.entryFullDTO.object?.id!} name={props.entryFullDTO.object?.name!} description={props.entryFullDTO.object?.description!} />
            <h3>Images</h3>
            <Dropzone onDrop={(acceptedFiles: Blob) => 
                toast.promise(props.saveImageToEntry(acceptedFiles), {
                        loading: 'Saving...',
                        success: `Successfully added image.`,
                        error: (err) => `Operation failed.\n ${err}`,
                      }) }/>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {props.entryFullDTO.images!.map(oneImage => {
                    const imageSrc = "data:image/jpg;base64," + oneImage.content
                    const imageName = oneImage.name
                    return (
                        <div key={oneImage.id}>
                            <h3>{imageName}</h3>
                            <img src={imageSrc} className="img-fluid" width="300px" alt={imageName} />
                            <DeleteConfirmationModal deleteObjectsInRelation={props.deleteImageFromEntry} categoryName="Image" title={oneImage.name!} id={props.entryFullDTO.object?.id!} secondId={oneImage.id} />
                        </div>)
                })}
            </Masonry>

            <h3>{props.subCategoryName}s</h3>
            <AddNewEntryModal categoryName={`new ${props.subCategoryName} that uses this ${props.categoryName}`} addNewSubEntryToRelation={props.addNewSubEntryToRelation} id={props.entryFullDTO.object?.id} />
            <AddFromListModal categoryName={`${props.subCategoryName} from the list`} fillTheListWithSubObjects={props.fillTheListWithAllSubObjects} addExistingObjectToRelation={props.addExistingObjectToRelation} id={props.entryFullDTO.object?.id} />

            <List className="p-1">
                {props.entryFullDTO.subObjects!.map(subObject => {
                    return (
                        <div className="w-100 p-3 btn btn-outline-info" key={subObject.id}>
                            <ListItem
                                key={subObject.id}
                                disableGutters
                                secondaryAction={
                                    <DeleteConfirmationModal deleteObjectsInRelation={props.deleteSubObject} categoryName={props.subCategoryName} title={subObject.name!} id={props.entryFullDTO.object?.id!} secondId={subObject.id} />
                                }
                            >
                                <ListItemText primary={subObject.name} secondary={
                                    <Link className="btn btn-outline-warning" to={`/${props.subCategoryLink}/${subObject.name}`} state={props.entryFullDTO}>Go to this {props.subCategoryName}</Link>
                                } />
                            </ListItem>
                        </div>)
                })}
            </List>
        </>
    )
}