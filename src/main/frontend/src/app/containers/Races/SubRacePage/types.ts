import { SubRaceDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

interface IOneSubRaceState {
    subRace: SubRaceDTO
}

interface ISubRacePageState {
    page: Page<SubRaceDTO>
}

export type {ISubRacePageState, IOneSubRaceState}