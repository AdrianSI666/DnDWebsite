import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { CulturePage } from './app/containers/CulturePage';
import { OneCulture } from './app/containers/CulturePage/OneCulture';
import { Home } from './app/containers/HomePage';
import { ContinentPage } from './app/containers/Maps/ContinentPage';
import { OneContinent } from './app/containers/Maps/ContinentPage/OneContinent';
import { KingdomPage } from './app/containers/Maps/KingdomPage';
import { OneKingdom } from './app/containers/Maps/KingdomPage/OneKingdom';
import { PlacePage } from './app/containers/Maps/PlacePage';
import { OnePlace } from './app/containers/Maps/PlacePage/OnePlace';
import { PlanePage } from './app/containers/Maps/PlanePage';
import { OnePlane } from './app/containers/Maps/PlanePage/OnePlane';
import { RegionPage } from './app/containers/Maps/RegionPage';
import { OneRegion } from './app/containers/Maps/RegionPage/OneRegion';
import { WorldPage } from './app/containers/Maps/WorldPage';
import { OneWorld } from './app/containers/Maps/WorldPage/OneWorld';
import { RacePage } from './app/containers/Races/RacePage';
import { OneRace } from './app/containers/Races/RacePage/OneRace';
import { SubRacePage } from './app/containers/Races/SubRacePage';
import { OneSubRace } from './app/containers/Races/SubRacePage/OneSubRace';
import { Root } from './app/containers/RootPage';
import { Login } from './app/containers/LoginAndRegistrationPage/LoginPage';
import { Register } from './app/containers/LoginAndRegistrationPage/RegisterPage';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const container = document.getElementById('root')!;
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1
    },
  }
})

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <Route path={"kingdoms"} element={<KingdomPage />} />
            <Route path={"kingdoms/:name"} element={<OneKingdom />} />
            <Route path={"regions"} element={<RegionPage />} />
            <Route path={"regions/:name"} element={<OneRegion />} />
            <Route path={"places"} element={<PlacePage />} />
            <Route path={"places/:name"} element={<OnePlace />} />
            <Route path={"login"} element={<Login/>}/>
            <Route path={"register"} element={<Register/>}/>
          </Route>
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
