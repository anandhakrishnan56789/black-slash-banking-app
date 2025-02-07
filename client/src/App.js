import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/navbar';
import Home from './components/home';
import CreateAccount from './components/createaccount';
import Login from './components/login';
import Deposit from './components/deposit';
import Withdraw from './components/withdraw';
import Admin from './components/admin';
import Description from './components/description';

import { AppContextProvider } from './context';

function App() {

  return (
    <>
      <AppContextProvider>
        <Router>
          <NavBar/>
          <Routes>
            <Route path="/" exact element={ <Home/> } />
            <Route path="/register/" exact element={ <CreateAccount/> } />
            <Route path="/login/" exact element={ <Login/> } />
            <Route path="/deposit/" exact element={ <Deposit/> } />
            <Route path="/withdraw/" exact element={ <Withdraw/> } />
            <Route path="/description/" exact element={ <Description/> } />

            <Route path="/data/" exact element={ <Admin/> } />
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  )
}

export default App;
