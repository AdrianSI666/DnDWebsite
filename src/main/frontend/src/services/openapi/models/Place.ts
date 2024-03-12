/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Race } from './Race';
import type { Region } from './Region';
import type { SubRace } from './SubRace';
export type Place = {
    id?: number;
    name?: string;
    description?: string;
    region?: Region;
    races?: Array<Race>;
    subRaces?: Array<SubRace>;
};

