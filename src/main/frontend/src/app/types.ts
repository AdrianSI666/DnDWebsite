import { IContinentPageState, IOneContinentState } from "./containers/Maps/ContinentPage/types";
import { IKingdomPageState, IOneKingdomState } from "./containers/Maps/KingdomPage/types";
import { IOnePlaceState, IPlacePageState } from "./containers/Maps/PlacePage/types";
import { IOnePlaneState, IPlanePageState } from "./containers/Maps/PlanePage/types";
import { IOneRegionState, IRegionPageState } from "./containers/Maps/RegionPage/types";
import { IOneWorldState, IWorldPageState } from "./containers/Maps/WorldPage/types";

export interface IRootState {
    worldPage: IWorldPageState,
    oneWorld: IOneWorldState,
    planePage: IPlanePageState,
    onePlane: IOnePlaneState,
    continentPage: IContinentPageState,
    oneContinent: IOneContinentState,
    kingdomPage: IKingdomPageState,
    oneKingdom: IOneKingdomState,
    regionPage: IRegionPageState,
    oneRegion: IOneRegionState,
    placePage: IPlacePageState,
    onePlace: IOnePlaceState
}