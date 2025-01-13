import { List, ListItem, ListItemText } from "@mui/material";
import { EntryDTO } from "../../../services/openapi";
import { AddFromListModal } from "../modals/addFromListModal";
import { AddNewEntryModal } from "../modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { addExistingObjectToRelation } from "../types";

interface ISubCategoryBody {
    mainEntryId: number,
    worldName: string;
    addButtonActionText: string;
    addExistingButtonActionText: string;
    deleteButtonActionText: string;
    subObjects?: EntryDTO[]
    subCategoryTitle: string;
    subCategoryLinkText: string;
    subCategoryLink: string;
    fillTheListWithAllSubObjects: () => Promise<void | EntryDTO[]>;
    addNewSubEntryToRelation: (id: number, name: string, description: string) => Promise<void>;
    addExistingObjectToRelation: (args: addExistingObjectToRelation) => Promise<void>;
    deleteSubObject: (id: number, secondId: number) => Promise<void>;
    isAuthor?: boolean
}

export function SubCategoryBody(props: Readonly<ISubCategoryBody>) {
    return (
        <>
            <h3>{props.subCategoryTitle}</h3>
            {props.isAuthor ? <>
                <AddNewEntryModal addButtonActionText={props.addButtonActionText} addNewSubEntryToRelation={props.addNewSubEntryToRelation} id={props.mainEntryId} />
                <AddFromListModal addButtonActionText={props.addExistingButtonActionText} categoryName={props.subCategoryTitle} fillTheListWithSubObjects={props.fillTheListWithAllSubObjects} addExistingObjectToRelation={props.addExistingObjectToRelation} id={props.mainEntryId} />
            </>
                : null}
            <List className="p-1">
                {props.subObjects!.map(subObject => {
                    return (
                        <div className="w-100 p-3 btn btn-outline-info" key={subObject.id}>
                            <ListItem
                                key={subObject.id}
                                disableGutters
                                secondaryAction={
                                    props.isAuthor ?
                                        <DeleteConfirmationModal deleteButtonActionText={props.deleteButtonActionText} deleteObjectsInRelation={props.deleteSubObject} title={subObject.name!} id={props.mainEntryId} secondId={subObject.id} />
                                        : null
                                }
                            >
                                <ListItemText
                                    primary={
                                        <>
                                            <a href={`/worlds/home/${props.worldName}/${props.subCategoryLink}/${subObject.name}`}>{subObject.name}</a>
                                            <div>{subObject.shortDescription}</div>
                                        </>
                                    }/>
                            </ListItem>
                        </div>)
                })}
            </List>
        </>
    )
}