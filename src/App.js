import './App.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import { BrowserRouter as Router, Switch,Route, Redirect } from 'react-router-dom';
import {Home, Dashboard, Login, Register, Game, Leaderboard} from "./rootComponents";

import Firebase from "firebase";
import config from "./config.js";

Firebase.initializeApp(config);

function blank(){
  return <div />;
}

class App extends React.Component {
  constructor(){
    super();
    this.state = { 
      page: blank
     };
     this.setState({page: Dashboard})
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/game" component={Game} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/logout" component={logOut} />
        </Switch>
    </Router>
    ) //used for routing the user to the right class
  }
}
function logOut(props){ //logout handler
  localStorage.removeItem ('uid')
  localStorage.removeItem ('username') //clear section data
  return <Redirect to="/login" /> 
}


export {App, Firebase};
