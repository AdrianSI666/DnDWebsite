import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './components/home/Home';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Culture from './components/culture/Culture';
import Root from './components/root/Root';
import Race from './components/race/Race';
import Subrace from './components/subrace/Subrace';
import Continent from './components/continent/Continent';
import Kingdom from './components/kingdom/Kingdom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path={"/"} element={<Root />}>
          <Route path={"home"} element={<Home />} />
          <Route path={"culture"} element={<Culture />} />
          <Route path={"race"} element={<Race />} />
          <Route path={"subrace"} element={<Subrace />} />
          <Route path={"continent"} element={<Continent />} />
          <Route path={"kingdom"} element={<Kingdom />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
