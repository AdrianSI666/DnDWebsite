import { ApiError, DescriptionControllerService, DescriptionDTO } from "../../services/openapi";

interface IGlobalDescriptionFunction {
    updateDescription?: (entryId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => void,
    updateOneEntryDescription?: (descriptionId:number, descriptionDTO: DescriptionDTO) => void,
}

export function GlobalDescriptionFunction(props: IGlobalDescriptionFunction) {
    const updateDescription = async (
        entryId: number,
        descriptionId: number,
        descriptionDTO: DescriptionDTO
    ) => {

        return DescriptionControllerService.updateDescription(descriptionId, descriptionDTO)
            .then((res) => {
                if (props.updateDescription) props.updateDescription(entryId, descriptionId, descriptionDTO)
                else if (props.updateOneEntryDescription) props.updateOneEntryDescription(descriptionId, descriptionDTO)
                else throw new Error("Didn't sepcify dispatch action when updating description.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }
    return { updateDescription };
}

