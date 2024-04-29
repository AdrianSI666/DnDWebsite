import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import Masonry from "react-masonry-css";
import { EntryFullDTO } from "../../../services/openapi";
import Dropzone from "../Dropzone";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EntryEditModal } from "../modals/entryEditModal";

interface IFullEntryAccordionBody {
    categoryName: string;
    deleteMainObjectButtonActionText: string;
    deleteImageButtonActionText: string;
    entryFullDTO: EntryFullDTO,
    deleteEntry: (id: number) => Promise<void>;
    updateEntry: (id: number, name: string, description: string) => Promise<void>;

    saveImageToEntry: (acceptedFiles: Blob) => Promise<void>;
    deleteImageFromEntry: (entryId: number, imageId: number) => Promise<void>;    
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
            <DeleteConfirmationModal deleteButtonActionText={props.deleteMainObjectButtonActionText}  deleteObject={props.deleteEntry} title={props.entryFullDTO.object?.name!} id={props.entryFullDTO.object?.id!} />
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
                            <DeleteConfirmationModal deleteButtonActionText={props.deleteImageButtonActionText}  deleteObjectsInRelation={props.deleteImageFromEntry} title={oneImage.name!} id={props.entryFullDTO.object?.id!} secondId={oneImage.id} />
                        </div>)
                })}
            </Masonry>
        </>
    )
}