import React from "react"
import { Link, Redirect } from 'react-router-dom';
import {Back, Template} from '../rootComponents';
import {loginHandler, register} from '../loginHandler';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Email:"",
        Username:"",
        Password:"",
        passwordConf:"",

      };
      this.handleChange = this.handleChange.bind(this);
      this.register = async () => {
        let response = await  register(this.state.Email, this.state.Password, this.state.Username)
        .then(() => this.setState({}  ))
        .catch( (error) =>{
            NotificationManager.error(error.message, `Error ${error.code}`, 5000)
        })

      }
    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})
      }

    render() {
      
      if (localStorage.getItem('uid')) return(
        <Redirect to="/dashboard" />
      )
      return (
        <div>
          <Template />
        <div class="split left">
          <div class="leftPageContentBox">
          <h3>Register</h3>
            <form>
              <input type="email" name="Email" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
              <input type="text" name="Username" placeholder="Username" onChange={this.handleChange} value={this.state.Username}/>
              <input type="password" name="Password" placeholder="Password"  onChange={this.handleChange} value={this.state.Password}/>
              <input type="password" name="passwordConf" placeholder="Confirm Password"  onChange={this.handleChange} value={this.state.passwordConf}/>
            </form>
            <button onClick={async () => {this.register()}} class="button1">Register</button>

            <Link to={"/login"}><h6>All ready have an account? LogIn</h6></Link>
          </div>
        <Back />
        <NotificationContainer/>

        </div>

      </div>
        
      )
    }
  }
export default Register;