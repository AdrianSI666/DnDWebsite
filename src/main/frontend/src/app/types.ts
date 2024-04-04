import { ICulturePageState, IOneCultureState } from "./containers/CulturePage/types";
import { IOneRaceState, IRacePageState } from "./containers/RacePage/types";

export interface IRootState {
    culturePage: ICulturePageState,
    oneCulture: IOneCultureState,
    racePage: IRacePageState,
    oneRace: IOneRaceState
}