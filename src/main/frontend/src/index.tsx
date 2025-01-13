import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { SpeciesPage } from './app/containers/Creatures/SpeciesPage';
import { OneSpecies } from './app/containers/Creatures/SpeciesPage/OneSpecies';
import { SubSpeciesPage } from './app/containers/Creatures/SubSpeciesPage';
import { CulturePage } from './app/containers/CulturePage';
import { ContinentPage } from './app/containers/Geography/ContinentPage';
import { OneContinent } from './app/containers/Geography/ContinentPage/OneContinent';
import { PlacePage } from './app/containers/Geography/PlacePage';
import { OnePlace } from './app/containers/Geography/PlacePage/OnePlace';
import { PlanePage } from './app/containers/Geography/PlanePage';
import { OnePlane } from './app/containers/Geography/PlanePage/OnePlane';
import { RegionPage } from './app/containers/Geography/RegionPage';
import { OneRegion } from './app/containers/Geography/RegionPage/OneRegion';
import { Home } from './app/containers/HomePage';
import { KingdomPage } from './app/containers/Politics/KingdomPage';
import { OneKingdom } from './app/containers/Politics/KingdomPage/OneKingdom';
import { Root } from './app/containers/RootPage';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LoginPage } from './app/containers/Authorization/login';
import SignupPage from './app/containers/Authorization/signup';
import { OneSubSpecies } from './app/containers/Creatures/SubSpeciesPage/OneSubSpecies';
import { TypePage } from './app/containers/Creatures/TypePage';
import { OneType } from './app/containers/Creatures/TypePage/OneType';
import { CountyPage } from './app/containers/Politics/CountyPage';
import { OneCounty } from './app/containers/Politics/CountyPage/OneCounty';
import { UserHomePage } from './app/containers/UserHomePage';
import { WorldHomePage } from './app/containers/WorldExtensions';
import { SpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SpeciesHomePage';
import { OneSubSpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SubSpeciesHomePage/OneSubSpeciesHomePage';
import { TypeHomePage } from './app/containers/WorldExtensions/CreatureHomePage/TypeHomePage';
import { OneTypeHomePage } from './app/containers/WorldExtensions/CreatureHomePage/TypeHomePage/OneTypeHomePage';
import { CultureHomePage } from './app/containers/WorldExtensions/CultureHomePage';
import { OneCultureHomePage } from './app/containers/WorldExtensions/CultureHomePage/OneCultureHomePage';
import { OneWorldHomePage } from './app/containers/WorldExtensions/OneWorldHomePage';
import { WorldPage } from './app/containers/WorldPage';
import { OneSpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SpeciesHomePage/OneSpeciesHomePage';
import { SubspeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SubSpeciesHomePage';

const container = document.getElementById('root')!;
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      retryDelay: 1000
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
            <Route path={"creatures/"}>
              <Route path={"types"} element={<TypePage />} />
              <Route path={"types/:name"} element={<OneType />} />
              <Route path={"species"} element={<SpeciesPage />} />
              <Route path={"species/:name"} element={<OneSpecies />} />
              <Route path={"subspecies"} element={<SubSpeciesPage />} />
              <Route path={"subspecies/:name"} element={<OneSubSpecies />} />
            </Route>
            <Route path={"politics/"}>
              <Route path={"kingdoms"} element={<KingdomPage />} />
              <Route path={"kingdoms/:name"} element={<OneKingdom />} />
              <Route path={"counties"} element={<CountyPage />} />
              <Route path={"counties/:name"} element={<OneCounty />} />
            </Route>
            <Route path={"worlds"} element={<WorldPage />} />
            <Route path={"worlds/home/"} element={<WorldHomePage />}>
              <Route path={":name"} element={<OneWorldHomePage />} />
              <Route path={":name/cultures"} element={<CultureHomePage />} />
              <Route path={":name/cultures/:cultureName"} element={<OneCultureHomePage />} />
              <Route path={":name/creatures/"}>
                <Route path={"types"} element={<TypeHomePage />} />
                <Route path={"types/:typeName"} element={<OneTypeHomePage />} />
                <Route path={"species"} element={<SpeciesHomePage />} />
                <Route path={"species/:speciesName"} element={<OneSpeciesHomePage />} />
                <Route path={"subspecies"} element={<SubspeciesHomePage />} />
                <Route path={"subspecies/:subspeciesName"} element={<OneSubSpeciesHomePage />} />
              </Route>
            </Route>
            <Route path={"geography/"}>
              <Route path={"planes"} element={<PlanePage />} />
              <Route path={"planes/:name"} element={<OnePlane />} />
              <Route path={"continents"} element={<ContinentPage />} />
              <Route path={"continents/:name"} element={<OneContinent />} />
              <Route path={"regions"} element={<RegionPage />} />
              <Route path={"regions/:name"} element={<OneRegion />} />
              <Route path={"places"} element={<PlacePage />} />
              <Route path={"places/:name"} element={<OnePlace />} />
            </Route>
            <Route path={"user/home"} element={<UserHomePage />} />
            <Route path={"login"} element={<LoginPage />} />
            <Route path={"signup"} element={<SignupPage />} />
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
