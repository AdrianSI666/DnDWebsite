import { RegionDTO, Page } from "../../../../services/openapi";

interface IOneRegionState {
    region: RegionDTO
}

interface IRegionPageState {
    page: Page<RegionDTO>
}

export type { IRegionPageState, IOneRegionState }