/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Continent } from './Continent';
import type { Culture } from './Culture';
import type { Kingdom } from './Kingdom';
import type { Place } from './Place';
import type { Race } from './Race';
import type { Region } from './Region';
import type { SubRace } from './SubRace';
export type Image = {
    id?: number;
    content?: Array<string>;
    name?: string;
    races?: Array<Race>;
    subRaces?: Array<SubRace>;
    cultures?: Array<Culture>;
    continents?: Array<Continent>;
    kingdoms?: Array<Kingdom>;
    places?: Array<Place>;
    regions?: Array<Region>;
};

