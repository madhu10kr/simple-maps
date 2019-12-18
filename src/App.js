import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import MapChart from "./components/map/MapChart";
import Event from './components/event/Event'

import './App.css';
import 'antd/dist/antd.css'; 

function App() {
  return (
    <Router>
    <div>
      <Switch>
        <Route exact path="/">
          <Event />
        </Route>

        {/* <Route exact path="/map">
          <MapChart />
        </Route>
         */}
      </Switch>
    </div>
  </Router>
  );
}


export default App;
