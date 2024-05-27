import { EntryFullDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

interface IOneWorldState {
    world: EntryFullDTO
}

interface IWorldPageState {
    page: Page<EntryFullDTO>
}

export type { IWorldPageState, IOneWorldState }