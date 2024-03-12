import { EntryFullDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";

export interface ICulturePageState {
    page: Page<EntryFullDTO>
}