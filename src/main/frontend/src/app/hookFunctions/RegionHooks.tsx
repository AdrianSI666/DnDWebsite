import { RegionControllerService } from "../../services/openapi";

const getAllRegions = async () => {
    return await RegionControllerService.getAllRegions()
        .catch((err) => {
            console.log("My Error: ", err);
        });
}

export {getAllRegions};