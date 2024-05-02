import { EntryDTO, EntryFullDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

interface IOneWorldState {
    world: EntryDTO
}

interface IWorldPageState {
    page: Page<EntryFullDTO>
}

export type { IWorldPageState, IOneWorldState }