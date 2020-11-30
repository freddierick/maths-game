import React from "react"
import {Back} from '../rootComponents';
import {Firebase} from '../App';

class Leaderboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        leaderboard: <div></div>
      }; //create default state
      this.handleChange = this.handleChange.bind(this);

    this.level = (level) => {
        //this fetches users scores for a given level
        return Firebase.database().ref('/scores').once('value').then((snapshot) => {
            let data = snapshot.val()
            let scores = {}
            Object.keys(data).forEach(element => {

                if(data[element].level==level){

                    if (!scores[data[element].user]) scores[data[element].user] = {score: 0};
                    scores[data[element].user].score += data[element].score //makes an object with all the users total scores
                }
            });


            // end fetch user scores 
            let userArray = []
            return Firebase.database().ref('/users/').once('value').then((snapshot) => { //fetches user data
                let data = snapshot.val()


                Object.keys(scores).forEach(element => {  // adds the usernames to there scores
                    scores[element].username = data[element].username;
                    userArray.push(scores[element])
                })

                let sortedUserArray = userArray.sort(function(a, b){return b.score-a.score}); //sorts the data

                if (sortedUserArray[0]==null) return this.setState({leaderboard:(<h3>Their is no data for this leaderboard right now!</h3>)}) //if there is no data display error
                let max = 10;
                if (sortedUserArray.length < 10) max = sortedUserArray.length; //if there is less than 10 entrees in the leaderboard 
                let JSX = [] 
                for (let i = 0; i < max; i++) {
                    JSX.push( <tr>
                        <td>{i+1}</td>
                        <td>{sortedUserArray[i].username}</td>
                        <td>{sortedUserArray[i].score}</td>
                    </tr> ) //compile the leaderboard data to be displayed
                }

                return this.setState({leaderboard:JSX}) //set the leaaderboard data
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

        </div>
        
      ) //leaderboard menu
    }
  }


export default Leaderboard;