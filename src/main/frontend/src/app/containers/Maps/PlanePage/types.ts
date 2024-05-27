import { EntryFullDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

interface IOnePlaneState {
    plane: EntryFullDTO
}

interface IPlanePageState {
    page: Page<EntryFullDTO>
}

export type { IPlanePageState, IOnePlaneState }