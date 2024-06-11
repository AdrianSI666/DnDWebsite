/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptionDTO } from './DescriptionDTO';
import type { EntryDTO } from './EntryDTO';
import type { ImageDTO } from './ImageDTO';
export type RaceDTO = {
    race?: EntryDTO;
    subRaces?: Array<EntryDTO>;
    descriptions?: Array<DescriptionDTO>;
    images?: Array<ImageDTO>;
    regions?: Array<EntryDTO>;
};

