
type addExistingObjectToRelation = {coreObjectId: number, objectToAddId: number, objectName: string, objectDescription: string};
type addNewEntry = {name: string, shortDescription: string};

type addNewSubEntryToRelation = {id: number, name: string, shortDescription: string};
type addNewDescriptionToEntry = {id: number, title: string, description: string}

type updateDescriptionFunction = {descriptionId: number, title: string, description: string}
type updateEntryFunction = {id: number, name: string, shortDescription: string}

type deleteObject = {id: number}
type deleteObjectsInRelation = {id: number, secondId: number}


export type {
    addExistingObjectToRelation, addNewDescriptionToEntry,
    addNewEntry, addNewSubEntryToRelation,
    deleteObject, deleteObjectsInRelation, updateDescriptionFunction, updateEntryFunction
};
