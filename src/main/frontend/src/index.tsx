import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { SpeciesPage } from './app/containers/AnonymousViews/Creatures/SpeciesPage';
import { SubSpeciesPage } from './app/containers/AnonymousViews/Creatures/SubSpeciesPage';
import { CulturePage } from './app/containers/AnonymousViews/CulturePage';
import { ContinentPage } from './app/containers/AnonymousViews/Geography/ContinentPage';
import { PlacePage } from './app/containers/AnonymousViews/Geography/PlacePage';
import { PlanePage } from './app/containers/AnonymousViews/Geography/PlanePage';
import { RegionPage } from './app/containers/AnonymousViews/Geography/RegionPage';
import { KingdomPage } from './app/containers/AnonymousViews/Politics/KingdomPage';
import { Home } from './app/containers/HomePage';
import { Root } from './app/containers/RootPage';
import { OneRegionHomePage } from './app/containers/WorldExtensions/GeographyHomePage/RegionHomePage/OneRegion';
import { OneKingdomHomePage } from './app/containers/WorldExtensions/PoliticsHomePage/KingdomHomePage/OneKingdom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TypePage } from './app/containers/AnonymousViews/Creatures/TypePage';
import { CountyPage } from './app/containers/AnonymousViews/Politics/CountyPage';
import { LoginPage } from './app/containers/Authorization/login';
import SignupPage from './app/containers/Authorization/signup';
import { UserHomePage } from './app/containers/UserHomePage';
import { WorldHomePage } from './app/containers/WorldExtensions';
import { SpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SpeciesHomePage';
import { OneSpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SpeciesHomePage/OneSpeciesHomePage';
import { SubspeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SubSpeciesHomePage';
import { OneSubSpeciesHomePage } from './app/containers/WorldExtensions/CreatureHomePage/SubSpeciesHomePage/OneSubSpeciesHomePage';
import { TypeHomePage } from './app/containers/WorldExtensions/CreatureHomePage/TypeHomePage';
import { OneTypeHomePage } from './app/containers/WorldExtensions/CreatureHomePage/TypeHomePage/OneTypeHomePage';
import { CultureHomePage } from './app/containers/WorldExtensions/CultureHomePage';
import { OneCultureHomePage } from './app/containers/WorldExtensions/CultureHomePage/OneCultureHomePage';
import { ContinentHomePage } from './app/containers/WorldExtensions/GeographyHomePage/ContinentHomePage';
import { PlaceHomePage } from './app/containers/WorldExtensions/GeographyHomePage/PlaceHomePage';
import { PlaneHomePage } from './app/containers/WorldExtensions/GeographyHomePage/PlaneHomePage';
import { RegionHomePage } from './app/containers/WorldExtensions/GeographyHomePage/RegionHomePage';
import { OneWorldHomePage } from './app/containers/WorldExtensions/OneWorldHomePage';
import { CountyHomePage } from './app/containers/WorldExtensions/PoliticsHomePage/CountyHomePage';
import { OneCountyHomePage } from './app/containers/WorldExtensions/PoliticsHomePage/CountyHomePage/OneCounty';
import { KingdomHomePage } from './app/containers/WorldExtensions/PoliticsHomePage/KingdomHomePage';
import { WorldPage } from './app/containers/AnonymousViews/WorldPage';
import { OneContinent } from './app/containers/WorldExtensions/GeographyHomePage/ContinentHomePage/OneContinent';
import { OnePlaceHomePage } from './app/containers/WorldExtensions/GeographyHomePage/PlaceHomePage/OnePlace';
import { OnePlaneHomePage } from './app/containers/WorldExtensions/GeographyHomePage/PlaneHomePage/OnePlane';

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
              <Route path={"species"} element={<SpeciesPage />} />
              <Route path={"subspecies"} element={<SubSpeciesPage />} />
            </Route>
            <Route path={"politics/"}>
              <Route path={"kingdoms"} element={<KingdomPage />} />
              <Route path={"counties"} element={<CountyPage />} />
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
              <Route path={":name/politics/"}>
                <Route path={"kingdoms"} element={<KingdomHomePage />} />
                <Route path={"kingdoms/:name"} element={<OneKingdomHomePage />} />
                <Route path={"counties"} element={<CountyHomePage />} />
                <Route path={"counties/:name"} element={<OneCountyHomePage />} />
              </Route>
              <Route path={":name/geography/"}>
                <Route path={"planes"} element={<PlaneHomePage />} />
                <Route path={"planes/:name"} element={<OnePlaneHomePage />} />
                <Route path={"continents"} element={<ContinentHomePage />} />
                <Route path={"continents/:name"} element={<OneContinent />} />
                <Route path={"regions"} element={<RegionHomePage />} />
                <Route path={"regions/:name"} element={<OneRegionHomePage />} />
                <Route path={"places"} element={<PlaceHomePage />} />
                <Route path={"places/:name"} element={<OnePlaceHomePage />} />
              </Route>
            </Route>
            <Route path={"geography/"}>
              <Route path={"planes"} element={<PlanePage />} />
              <Route path={"continents"} element={<ContinentPage />} />
              <Route path={"regions"} element={<RegionPage />} />
              <Route path={"places"} element={<PlacePage />} />
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
