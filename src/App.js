import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import ExchangeManager from './components/ExchangeManager.js'
import ExchangeRates from './components/ExchangeRates.js'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Currency Exchange
        </p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

      </header>
      <Router>
        
        <Route exact path='/' component={ExchangeManager} />
        <Route path='/rates' component={ExchangeRates} />
        
        
      </Router>
    </div>
  );
}

export default App;
