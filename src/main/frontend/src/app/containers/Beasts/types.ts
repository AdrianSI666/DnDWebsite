import { BeastDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";

interface IOneBeastState {
    beast: BeastDTO
}

interface IBeastPageState {
    page: Page<BeastDTO>
}

export type {IBeastPageState, IOneBeastState}