import { EntryFullDTO, Page } from "../../../../services/openapi";

interface IOneKingdomState {
    kingdom: EntryFullDTO
}

interface IKingdomPageState {
    page: Page<EntryFullDTO>
}

export type { IKingdomPageState, IOneKingdomState }