import { useMutation } from "@tanstack/react-query";
import { DescriptionControllerService, DescriptionDTO } from "../../services/openapi";

interface IUpdateDescriotion {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

export function GlobalDescriptionFunction() {
    const updateDescriptionMutation = useMutation({
        mutationFn: (updateDescription: IUpdateDescriotion) => DescriptionControllerService.updateDescription(updateDescription.descriptionId, updateDescription.descriptionDTO),
    })

    return { updateDescriptionMutation };
}

