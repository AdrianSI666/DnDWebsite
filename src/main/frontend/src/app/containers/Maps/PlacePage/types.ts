import { EntryFullDTO, Page } from "../../../../services/openapi";

interface IOnePlaceState {
    place: EntryFullDTO
}

interface IPlacePageState {
    page: Page<EntryFullDTO>
}

export type { IPlacePageState, IOnePlaceState }