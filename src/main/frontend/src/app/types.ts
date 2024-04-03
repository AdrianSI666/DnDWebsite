import { ICulturePageState, IOneCultureState } from "./containers/CulturePage/types";

export interface IRootState {
    culturePage: ICulturePageState,
    oneCulture: IOneCultureState,
}