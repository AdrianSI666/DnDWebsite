import { EntryFullDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";

interface IOneCultureState {
    culture: EntryFullDTO
}

interface ICulturePageState {
    page: Page<EntryFullDTO>
}

export type {ICulturePageState, IOneCultureState}