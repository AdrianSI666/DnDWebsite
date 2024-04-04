import { RaceDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";

interface IOneRaceState {
    race: RaceDTO
}

interface IRacePageState {
    page: Page<RaceDTO>
}

export type {IRacePageState, IOneRaceState}