/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptionDTO } from './DescriptionDTO';
import type { EntryDTO } from './EntryDTO';
import type { ImageDTO } from './ImageDTO';
export type PlaneFullDTO = {
    plane?: EntryDTO;
    world?: EntryDTO;
    images?: Array<ImageDTO>;
    descriptions?: Array<DescriptionDTO>;
    continents?: Array<EntryDTO>;
    creatureTypes?: Array<EntryDTO>;
};

