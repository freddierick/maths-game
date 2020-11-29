import React from "react"
import { Link } from 'react-router-dom';
import {loginHandler, register} from './loginHandler';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Login from './element/login';
import Register from './element/register';
import Game from './element/game'
function Back(props) {
  return <Link to={"/"} style={{position:"fixed", bottom:"0px",left:"0px"}}><h6>Home</h6></Link>;
}


class Template extends React.Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>
        <div class="split right">
        <img class="monkeyImg" alt="monkey" src="/monkey-1.png" />
        </div>
      </div>

    )
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
}
    render() {
      return (
        <div>
        <Template />
        <div class="split left">
          <div class="leftPageContentBox">
          <h3>Welcome back {localStorage.getItem('username')}! What would you like to do today?</h3>
          <h6>Games</h6>
        <Link to={"/game"}><button onClick={() => { localStorage.setItem('gameLevel', 0) }} styles="box-shadow: 0px 0px 0px 13px rgba(34,255,0,1);" class="button1" type="submit">Level 0</button></Link> <br/>
         <Link to={"/game"}><button onClick={() => { localStorage.setItem('gameLevel', 1) }} class="button1" type="submit">Level 1</button></Link> <br/>
         <Link to={"/game"}><button onClick={() => { localStorage.setItem('gameLevel', 2) }} class="button1" type="submit">Level 2</button></Link> <br/>
          <br />
          <h6>Leaderboards</h6>
          <Link to={"/leaderboards"}><button class="button1" type="submit">Leaderboards</button></Link>
          </div>
          </div>
        <Back />
        </div>
      )
    }
  }


  class Home extends React.Component {
    render() {
      return (
        <div>
          <Template />
        <div class="split left">
          <div class="leftPageContentBox">
          <h3>Welcome to Maths Mayhem! would you like to login or register today?</h3>
          <Link to={"/login"}><button class="button1" type="submit">Login</button></Link> <br/>
          <Link to={"/register"}><button class="button1" type="submit">Register</button></Link>
          <Link to={"/dashboard"}><button class="button1" type="submit">NOT ADDED GO TO DASH</button></Link>
          </div>
        <Back />

        </div>

      </div>
        
      )
    }
  }
export {Home, Dashboard, Login, Register, Back, Template, Game};