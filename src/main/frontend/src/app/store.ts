import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import culturePageReducer from './containers/CulturePage/store/culturePageSlice';
import logger from 'redux-logger'
import oneCultureSlice from './containers/CulturePage/OneCulture/store/oneCultureSlice';
import racePageSlice from './containers/Races/RacePage/store/racePageSlice';
import oneRaceSlice from './containers/Races/RacePage/OneRace/store/oneRaceSlice';
import subRacePageSlice from './containers/Races/SubRacePage/store/subRacePageSlice';
import oneSubRaceSlice from './containers/Races/SubRacePage/OneSubRace/store/oneSubRaceSlice';
import worldPageSlice from './containers/Maps/WorldPage/store/worldPageSlice';
import oneWorldSlice from './containers/Maps/WorldPage/OneWorld/store/oneWorldSlice';
import planePageSlice from './containers/Maps/PlanePage/store/planePageSlice';
import onePlaneSlice from './containers/Maps/PlanePage/OnePlane/store/onePlaneSlice';
import continentPageSlice from './containers/Maps/ContinentPage/store/continentPageSlice';
import oneContinentSlice from './containers/Maps/ContinentPage/OneContinent/store/oneContinentSlice';

export const store = configureStore({
  reducer: {
    culturePage: culturePageReducer,
    oneCulture: oneCultureSlice,
    racePage: racePageSlice,
    oneRace: oneRaceSlice,
    subRacePage: subRacePageSlice,
    oneSubRace: oneSubRaceSlice,
    worldPage: worldPageSlice,
    oneWorld: oneWorldSlice,
    planePage: planePageSlice,
    onePlane: onePlaneSlice,
    continentPage: continentPageSlice,
    oneContinent: oneContinentSlice
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

