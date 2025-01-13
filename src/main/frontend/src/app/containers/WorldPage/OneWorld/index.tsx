import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { WorldFunctionArray } from "../worldFunctionArrays";
import { UseOneWorldFunction } from "../../WorldExtensions/OneWorldHomePage/useOneWorldFunction";
import { WorldControllerService } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../components/accordions/oneEntryHeaderLayout";

export function OneWorld() {
    let { name } = useParams();
    const { status, data: worldDTO, error } = useQuery({
        queryKey: ["world", name],
        queryFn: async () => WorldControllerService.getWorldByName(name!)
    })

    const { removeWorld, editWorld } = UseOneWorldFunction({ name: name! });
    const { saveImageToWorld, deleteImageFromWorld,
        addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunctionArray({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;


    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this world"}
        deleteEntry={removeWorld}
        updateEntry={editWorld} categoryName={"World"} entryFullDTO={{
            object: worldDTO.world,
            images: worldDTO.images,
            descriptions: worldDTO.descriptions
        }}>
        <FullEntryAccordionBody categoryName={"World"} entryFullDTO={{
            object: worldDTO.world,
            images: worldDTO.images,
            descriptions: worldDTO.descriptions
        }}
            saveImageToEntry={saveImageToWorld}
            deleteImageFromEntry={deleteImageFromWorld}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToWorld}
            updateDescription={updateWorldDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
    </OneEntryHeaderLayout>
}