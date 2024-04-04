import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import culturePageReducer from './containers/CulturePage/store/culturePageSlice';
import logger from 'redux-logger'
import oneCultureSlice from './containers/CulturePage/OneCulture/store/oneCultureSlice';
import racePageSlice from './containers/RacePage/store/racePageSlice';
import oneRaceSlice from './containers/RacePage/OneCulture/store/oneRaceSlice';

export const store = configureStore({
  reducer: {
    culturePage: culturePageReducer,
    oneCulture: oneCultureSlice,
    racePage: racePageSlice,
    oneRace: oneRaceSlice
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

