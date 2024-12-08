/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptionDTO } from './DescriptionDTO';
import type { EntryDTO } from './EntryDTO';
import type { ImageDTO } from './ImageDTO';
export type WorldDTO = {
    world?: EntryDTO;
    descriptions?: Array<DescriptionDTO>;
    images?: Array<ImageDTO>;
    authorId: Number,
    authorName: String
};

