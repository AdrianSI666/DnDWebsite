/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptionDTO } from './DescriptionDTO';
import type { EntryDTO } from './EntryDTO';
import type { ImageDTO } from './ImageDTO';
export type RegionDTO = {
    region?: EntryDTO;
    kingdom?: EntryDTO;
    places?: Array<EntryDTO>;
    descriptions?: Array<DescriptionDTO>;
    images?: Array<ImageDTO>;
    cultures?: Array<EntryDTO>;
    races?: Array<EntryDTO>;
    subRaces?: Array<EntryDTO>;
};

