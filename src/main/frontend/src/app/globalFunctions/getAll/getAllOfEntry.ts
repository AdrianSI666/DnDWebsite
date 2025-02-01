import { ContinentControllerService, ContinentRegionControllerService, CountyControllerService, CountyRegionControllerService, CreatureTypeControllerService, CreatureTypeSpeciesControllerService, CultureControllerService, KingdomControllerService, KingdomCountyControllerService, PlaneContinentControllerService, PlaneControllerService, RegionControllerService, RegionPlaceControllerService, SpeciesControllerService, SpeciesSubSpeciesControllerService, SubSpeciesControllerService } from "../../../services/openapi";

interface IGetAllOfEntryFunctions {
    worldId: number
}

export function GetAllOfEntryFunctions(props: IGetAllOfEntryFunctions) {
    const getAllContinents = async () => {
        return await ContinentControllerService.getAllContinents(props.worldId);
    }

    const getAllContinentsWithoutPlane = async () => {
        return await PlaneContinentControllerService.getAllContinentsWithoutPlane(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllCounties = async () => {
        return await CountyControllerService.getAllCounties(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllCountiesWithoutKingdom = async () => {
        return await KingdomCountyControllerService.getAllCountiesWithoutKingdom(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllCreatureTypes = async () => {
        return await CreatureTypeControllerService.getAllCreatureTypes(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllCultures = async () => {
        return await CultureControllerService.getAllCultures(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllKingdoms = async () => {
        return await KingdomControllerService.getAllKingdoms(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllPlanes = async () => {
        return await PlaneControllerService.getAllPlanes(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllPlacesWithoutRegion = async () => {
        return await RegionPlaceControllerService.getAllPlacesWithoutRegion(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllRegions = async () => {
        return await RegionControllerService.getAllRegions(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllRegionsWithoutContinent = async () => {
        return await ContinentRegionControllerService.getAllRegionsWithoutContinent(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllRegionsWithoutCounty = async () => {
        return await CountyRegionControllerService.getAllRegionsWithoutCounty(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllSpeciesWithoutCreatureType = async () => {
        return await CreatureTypeSpeciesControllerService.getAllSpeciesWithoutCreatureType(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllSpecies = async () => {
        return await SpeciesControllerService.getAllSpecies(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const getAllSubSpecies = async () => {
        return await SubSpeciesControllerService.getAllSubSpecies(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }
    
    const getAllSubSpeciesWithoutSpecies = async () => {
        return await SpeciesSubSpeciesControllerService.getAllSubSpeciesWithoutSpecies(props.worldId)
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }
    
    return { getAllContinents, getAllContinentsWithoutPlane,
        getAllCounties, getAllCountiesWithoutKingdom, 
        getAllCreatureTypes, 
        getAllCultures, 
        getAllKingdoms, 
        getAllPlacesWithoutRegion, 
        getAllPlanes, 
        getAllRegions, getAllRegionsWithoutContinent,
        getAllSpecies, getAllSpeciesWithoutCreatureType,
        getAllSubSpecies, getAllSubSpeciesWithoutSpecies }
}