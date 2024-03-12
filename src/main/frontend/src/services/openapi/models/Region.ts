/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Culture } from './Culture';
import type { Kingdom } from './Kingdom';
import type { Place } from './Place';
import type { Race } from './Race';
import type { SubRace } from './SubRace';
export type Region = {
    id?: number;
    name?: string;
    description?: string;
    kingdom?: Kingdom;
    places?: Array<Place>;
    cultures?: Array<Culture>;
    races?: Array<Race>;
    subRaces?: Array<SubRace>;
};

