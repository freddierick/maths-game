import React from "react"
import { Link } from 'react-router-dom';
import {Back, Template} from '../rootComponents';
import {loginHandler, register} from '../loginHandler';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Email:"",
        Password:"",
      };
      this.handleChange = this.handleChange.bind(this);
      this.login = async () => {
        let response = await  loginHandler(this.state.Email, this.state.Password)
        .catch( (error) =>{
          NotificationManager.error(error.message, `Error ${error.code}`, 5000)
        })
      }
    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})
      }
    
    render() {
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
            <button type="submit"class="button1" onClick={async () => {this.login()}}>Login</button>

            <Link to={"/register"}><h6>Don't have an account yet? Register</h6></Link>
          </div>
        <Back />
        <NotificationContainer/>
        </div>

      </div>
        
      )
    }
  }
export default Login;