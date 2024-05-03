import { ICulturePageState, IOneCultureState } from "./containers/CulturePage/types";
import { IContinentPageState, IOneContinentState } from "./containers/Maps/ContinentPage/types";
import { IOnePlaneState, IPlanePageState } from "./containers/Maps/PlanePage/types";
import { IOneWorldState, IWorldPageState } from "./containers/Maps/WorldPage/types";
import { IOneRaceState, IRacePageState } from "./containers/Races/RacePage/types";
import { IOneSubRaceState, ISubRacePageState } from "./containers/Races/SubRacePage/types";

export interface IRootState {
    culturePage: ICulturePageState,
    oneCulture: IOneCultureState,
    racePage: IRacePageState,
    oneRace: IOneRaceState,
    subRacePage: ISubRacePageState,
    oneSubRace: IOneSubRaceState,
    worldPage: IWorldPageState,
    oneWorld: IOneWorldState,
    planePage: IPlanePageState,
    onePlane: IOnePlaneState,
    continentPage: IContinentPageState,
    oneContinent: IOneContinentState
}