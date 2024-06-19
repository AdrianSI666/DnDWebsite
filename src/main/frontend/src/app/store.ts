import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import oneContinentSlice from './containers/Maps/ContinentPage/OneContinent/store/oneContinentSlice';
import continentPageSlice from './containers/Maps/ContinentPage/store/continentPageSlice';
import oneKingdomSlice from './containers/Maps/KingdomPage/OneKingdom/store/oneKingdomSlice';
import kingdomPageSlice from './containers/Maps/KingdomPage/store/kingdomPageSlice';
import onePlaceSlice from './containers/Maps/PlacePage/OnePlace/store/onePlaceSlice';
import placePageSlice from './containers/Maps/PlacePage/store/placePageSlice';
import onePlaneSlice from './containers/Maps/PlanePage/OnePlane/store/onePlaneSlice';
import planePageSlice from './containers/Maps/PlanePage/store/planePageSlice';
import oneRegionSlice from './containers/Maps/RegionPage/OneRegion/store/oneRegionSlice';
import regionPageSlice from './containers/Maps/RegionPage/store/regionPageSlice';
import oneWorldSlice from './containers/Maps/WorldPage/OneWorld/store/oneWorldSlice';
import worldPageSlice from './containers/Maps/WorldPage/store/worldPageSlice';
import oneRaceSlice from './containers/Races/RacePage/OneRace/store/oneRaceSlice';
import racePageSlice from './containers/Races/RacePage/store/racePageSlice';
import oneSubRaceSlice from './containers/Races/SubRacePage/OneSubRace/store/oneSubRaceSlice';
import subRacePageSlice from './containers/Races/SubRacePage/store/subRacePageSlice';

export const store = configureStore({
  reducer: {
    racePage: racePageSlice,
    oneRace: oneRaceSlice,
    subRacePage: subRacePageSlice,
    oneSubRace: oneSubRaceSlice,
    worldPage: worldPageSlice,
    oneWorld: oneWorldSlice,
    planePage: planePageSlice,
    onePlane: onePlaneSlice,
    continentPage: continentPageSlice,
    oneContinent: oneContinentSlice,
    kingdomPage: kingdomPageSlice,
    oneKingdom: oneKingdomSlice,
    regionPage: regionPageSlice,
    oneRegion: oneRegionSlice,
    placePage: placePageSlice,
    onePlace: onePlaceSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(createCustomMiddleWare()),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
function createCustomMiddleWare(): any {
  return logger;
}

