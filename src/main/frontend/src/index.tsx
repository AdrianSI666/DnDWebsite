import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Root } from './app/containers/RootPage';
import { CulturePage } from './app/containers/CulturePage';
import { Home } from './app/containers/HomePage';
import { RegionPage } from './app/containers/Maps/RegionPage';
import { OneCulture } from './app/containers/CulturePage/OneCulture';
import { RacePage } from './app/containers/Races/RacePage';
import { OneRace } from './app/containers/Races/RacePage/OneRace';
import { SubRacePage } from './app/containers/Races/SubRacePage';
import { OneSubRace } from './app/containers/Races/SubRacePage/OneSubRace';
import { WorldPage } from './app/containers/Maps/WorldPage';
import { OneWorld } from './app/containers/Maps/WorldPage/OneWorld';
import { PlanePage } from './app/containers/Maps/PlanePage';
import { OnePlane } from './app/containers/Maps/PlanePage/OnePlane';
import { ContinentPage } from './app/containers/Maps/ContinentPage';
import { OneContinent } from './app/containers/Maps/ContinentPage/OneContinent';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path={"/"} element={<Root />}>
            <Route index element={<Home />} />
            <Route path={"home"} element={<Home />} />
            <Route path={"cultures"} element={<CulturePage />} />
            <Route path={"cultures/:name"} element={<OneCulture />} />
            <Route path={"races"} element={<RacePage />} />
            <Route path={"races/:name"} element={<OneRace />} />
            <Route path={"subraces"} element={<SubRacePage />} />
            <Route path={"subraces/:name"} element={<OneSubRace />} />
            <Route path={"worlds"} element={<WorldPage />} />
            <Route path={"worlds/:name"} element={<OneWorld />} />
            <Route path={"planes"} element={<PlanePage />} />
            <Route path={"planes/:name"} element={<OnePlane />} />
            <Route path={"continents"} element={<ContinentPage />} />
            <Route path={"continents/:name"} element={<OneContinent />} />
            <Route path={"regions/:name"} element={<RegionPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
