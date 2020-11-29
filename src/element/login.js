import React from "react"
import { Link, Redirect } from 'react-router-dom';
import {Back, Template } from '../rootComponents';
import {loginHandler} from '../loginHandler';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Email:"",
        Password:"",
        loggedIn: false
      };
      this.handleChange = this.handleChange.bind(this);
      this.login = async () => {
        await  loginHandler(this.state.Email, this.state.Password) //logs the user in
        .then(() => this.setState({}  ))
        .catch( (error) =>{
          NotificationManager.error(error.message, `Error ${error.code}`, 5000) //if error tell the user
        })
        
      }
      this.login = this.login.bind(this);

    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})
      }
    
    render() {
      if (localStorage.getItem('uid')  || this.state.loggedIn ) return(
        <Redirect to="/dashboard" />
      ) 
      return (
        <div>
          <Template />
        <div class="split left">
          <div class="leftPageContentBox">
          <h3>Login</h3>
            <form>
              <input type="email" name="Email" onChange={this.handleChange} placeholder="Email" />
              <input type="password" name="Password" onChange={this.handleChange} placeholder="Password" />
            </form>
            <button type="submit"class="button1" onClick={async () => {await this.login(); return this.setState({loggedIn:true})}}>Login</button>

            <Link to={"/register"}><h6>Don't have an account yet? Register</h6></Link>
          </div>
        <Back />
        <NotificationContainer/>
        </div>

      </div>
        
      ) //login menu
    }
  }
export default Login;