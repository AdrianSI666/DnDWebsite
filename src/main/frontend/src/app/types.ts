import { ICulturePageState, IOneCultureState } from "./containers/CulturePage/types";
import { IWorldPageState } from "./containers/Maps/WorldPage/types";
import { IOneRaceState, IRacePageState } from "./containers/Races/RacePage/types";
import { IOneSubRaceState, ISubRacePageState } from "./containers/Races/SubRacePage/types";

export interface IRootState {
    culturePage: ICulturePageState,
    oneCulture: IOneCultureState,
    racePage: IRacePageState,
    oneRace: IOneRaceState,
    subRacePage: ISubRacePageState,
    oneSubRace: IOneSubRaceState,
    worldPage: IWorldPageState
}