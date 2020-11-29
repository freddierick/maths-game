import React from "react"
import { Link, Redirect } from 'react-router-dom';
import {Back, Template} from '../rootComponents';
import {Firebase} from '../App';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Leaderboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        leaderboard: <div></div>
      };
      this.handleChange = this.handleChange.bind(this);


      this.lbEntry = (props) => {
            return (  
            <tr>
                <td>{props.data.pos}</td>
                <td>{props.data.name}</td>
                <td>{props.data.score}</td>
            </tr>
        )
    }
    this.level = (level) => {
        //this fetches users scores for a given level
        return Firebase.database().ref('/scores').once('value').then((snapshot) => {
            let data = snapshot.val()
            console.log(data)
            let scores = {}
            Object.keys(data).forEach(element => {
                console.log(data[element])
                if(data[element].level==level){
                    if (!scores[data[element].user]) scores[data[element].user] = {score: 0};
                    scores[data[element].user].score += data[element].score
                }
            });
            // end fetch user scores 
            let userArray = []
            return Firebase.database().ref('/users/').once('value').then((snapshot) => {
                let data = snapshot.val()
                Object.keys(scores).forEach(element => {
                    scores[element].username = data[element].username;
                    userArray.push(scores[element])
                })
                let sortedUserArray = userArray.sort(function(a, b){return b.score-a.score});
                console.log(sortedUserArray)
                if (sortedUserArray[0]==null) return this.setState({leaderboard:(<h3>Their is no data for this leaderboard right now!</h3>)})
                let max = 10;
                if (sortedUserArray.length < 10) max = sortedUserArray.length;
                let JSX = []
                for (let i = 0; i < max; i++) {
                    JSX.push( <tr>
                        <td>{i+1}</td>
                        <td>{sortedUserArray[i].score}</td>
                        <td>{sortedUserArray[i].username}</td>
                    </tr> )
                }

                return this.setState({leaderboard:JSX})
        })
    })
}


    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})
      }
    componentDidMount() {
        this.level(0);
    }
    render() {
        console.log(this.state.leaderboard)
      return (
        <div>
            <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>

          <div class="gameBox">
          <h2>Leaderboards</h2>
            <button onClick={async () => {this.level(0)}} class="button3">Level 0</button>   
            <button onClick={async () => {this.level(1)}} class="button3">Level 1</button>
            <button onClick={async () => {this.level(2)}} class="button3">Level 2</button>
            <br />
            <table styles="width:100%">
                        <tr>
                        <th>Position</th>
                        <th>Username</th>
                        <th>Score</th>
                        </tr>
                        {this.state.leaderboard}
                    </table>
            
          
          </div>
        <Back />
        <NotificationContainer/>

        </div>
        
      )
    }
  }


export default Leaderboard;