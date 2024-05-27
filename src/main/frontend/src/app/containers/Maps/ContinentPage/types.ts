import { EntryFullDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

interface IOneContinentState {
    continent: EntryFullDTO
}

interface IContinentPageState {
    page: Page<EntryFullDTO>
}

export type { IContinentPageState, IOneContinentState }