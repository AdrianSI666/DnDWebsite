import { EntryDTO } from "../../../services/openapi";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { AddNewEntryModal } from "../modals/addNewEntryModal";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { AddFromListModal } from "../modals/addFromListModal";

interface ISubCategoryBody {
    mainEntryId: number,
    addButtonActionText: string;
    addExistingButtonActionText: string;
    deleteButtonActionText: string;

    subObjects?: EntryDTO[]
    subCategoryTitle: string;
    subCategoryLinkText: string;
    subCategoryLink: string;
    fillTheListWithAllSubObjects: () => Promise<void | EntryDTO[]>;
    addNewSubEntryToRelation: (id: number, name: string, description: string) => Promise<void>;
    addExistingObjectToRelation: (coreObjectId: number, objectToAddId: number, objectName: string, objectDescription: string) => Promise<void>;
    deleteSubObject: (id: number, secondId: number) => Promise<void>;

}

export function SubCategoryBody(props: Readonly<ISubCategoryBody>) {
    return (
        <>
            <h3>{props.subCategoryTitle}</h3>
            <AddNewEntryModal addButtonActionText={props.addButtonActionText} addNewSubEntryToRelation={props.addNewSubEntryToRelation} id={props.mainEntryId} />
            <AddFromListModal addButtonActionText={props.addExistingButtonActionText} categoryName={props.subCategoryTitle} fillTheListWithSubObjects={props.fillTheListWithAllSubObjects} addExistingObjectToRelation={props.addExistingObjectToRelation} id={props.mainEntryId} />

            <List className="p-1">
                {props.subObjects!.map(subObject => {
                    return (
                        <div className="w-100 p-3 btn btn-outline-info" key={subObject.id}>
                            <ListItem
                                key={subObject.id}
                                disableGutters
                                secondaryAction={
                                    <DeleteConfirmationModal deleteButtonActionText={props.deleteButtonActionText} deleteObjectsInRelation={props.deleteSubObject} title={subObject.name!} id={props.mainEntryId} secondId={subObject.id} />
                                }
                            >
                                <ListItemText
                                    primary={
                                        <>
                                            <div>{subObject.name}</div>
                                            <div>{subObject.shortDescription}</div>
                                        </>
                                    }
                                    secondary={
                                        <Link className="btn btn-outline-warning" to={`/${props.subCategoryLink}/${subObject.name}`} state={props.mainEntryId}>Go to this {props.subCategoryLinkText}</Link>
                                    } />
                            </ListItem>
                        </div>)
                })}
            </List>
        </>
    )
}