import { Link } from "react-router-dom";
import { EntryDTO } from "../../../services/openapi";
import { AddFromListModal } from "../modals/addFromListModal";
import { AddNewEntryModal } from "../modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { addExistingObjectToRelation } from "../types";

interface ISubCategoryBody {
    categoryName: string;

    addButtonActionText: string;
    addExistingButtonActionText: string;
    deleteButtonActionText: string;

    mainEntryId: number;
    descriptionOfConnectionString: string;
    descriptionOfNullConnectionString: string;

    domObject?: EntryDTO;
    domCategoryName: string;
    domCategoryLink: string;
    fillTheListWithAllSubObjects: () => Promise<void | EntryDTO[]>;
    setNewDomEntryToRelation: (id: number, name: string, description: string) => Promise<void>;
    addExistingObjectToRelation: (args: addExistingObjectToRelation) => Promise<void>;
    deleteSubObject: (id: number, secondId: number) => Promise<void>;

}

export function DomCategoryBody(props: Readonly<ISubCategoryBody>) {
    let header = props.descriptionOfNullConnectionString
    if (props.domObject !== null && props.domObject !== undefined) {
        header = props.descriptionOfConnectionString + " " + props.domObject?.name
    }
    return (
        <>
            <h4>{header}</h4>
            {props.domObject && <>
                <Link className="btn btn-outline-warning" to={`/${props.domCategoryLink}/${props.domObject?.name}`} state={props.mainEntryId}>Open description of {props.domObject?.name}</Link>
                <DeleteConfirmationModal deleteButtonActionText={props.deleteButtonActionText} deleteObjectsInRelation={props.deleteSubObject} title={props.domObject?.name!} id={props.mainEntryId} secondId={props.domObject?.id}
                /> </>
            }
            <AddNewEntryModal addButtonActionText={props.addButtonActionText} addNewSubEntryToRelation={props.setNewDomEntryToRelation} id={props.mainEntryId} />
            <AddFromListModal addButtonActionText={props.addExistingButtonActionText} categoryName={`${props.categoryName}`} fillTheListWithSubObjects={props.fillTheListWithAllSubObjects} addExistingObjectToRelation={props.addExistingObjectToRelation} id={props.mainEntryId} />

        </>
    )
}