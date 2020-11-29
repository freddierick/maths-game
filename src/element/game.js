import React from "react"
import { Link, Redirect } from 'react-router-dom';
import {Back} from '../rootComponents';
import {Firebase} from '../App';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { ProgressBar } from 'react-bootstrap';

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

const introPage = ["unlimited","20 seconds","10 seconds"]
class Game extends React.Component {
    constructor(props) {
      super(props);
      this.level = localStorage.getItem('gameLevel');
      this.time = 0; if (this.level === 1); this.time = 20;if (this.level === 2) this.time = 10;
      this.state = {
        currantQuestionNum:0,
        score:0,
        styles:[{},{},{},{}],
        questions: calculateQuestions(this.level),
        gameStarted:false,
        displayingCorrect:false,
        timeLeft: 0,
        currantQuestion: {},
        gameOver:false,
        scoreSaved:false
       }; //create default state
       
       this.timeLeft = (props) => {
        return (
            <div class="timeBox">
            <h3>Time left:</h3>
            <strong><p>{props.time}</p></strong>
            </div>
        ) 
        } //for the time box

        this.score = (props) => {
            return (
                <div class="scoreBox">
                    <h3>Score:</h3>
                    <p>{props.score}</p>
                </div>
            )
            } // for the score box
 
       this.clickAnswer = (answer) => {
           if(this.state.displayingCorrect) return; //if the correct answer is being displayed exit
            let currentQuestion = this.state.currantQuestion;
            let correctIndex = currentQuestion.options.indexOf(currentQuestion.answer); //figure out the index of the correct answer 

            if (correctIndex===answer){ //if the index of the answer is the same as the answer given 
                let newStyle = this.state.styles[correctIndex] = {backgroundColor: "green"} // make the selected element green
                
                this.setState({displayingCorrect:true, style:newStyle, score: this.state.score+1000 }) //add to the users score and update the elements
            }else{ //if the user got the answer wrong
                let newStyle = this.state.styles
                newStyle[correctIndex] = {backgroundColor: "green"} //make the correct answer green
                newStyle[answer] = {backgroundColor: "red"} // make the selected element red
                this.setState({displayingCorrect:true, style:newStyle })  // update the states
            }
       }
       this.nextQuestion = () => {  // fires if the user clicks next
           if (this.state.currantQuestionNum+1 === this.state.questions.length) return this.setState({gameOver:true})  // checks to see if there is anymore questions if there isn't it starts game over
            this.setState({currantQuestionNum: this.state.currantQuestionNum+1, currantQuestion: this.state.questions[this.state.currantQuestionNum+1],styles:[{},{},{},{}],displayingCorrect:false, timeLeft: this.time})  // prepares the  game board for another question
         }
// binds the functions to this --
      this.clickAnswer = this.clickAnswer.bind(this);
      this.calculateQuestions = calculateQuestions.bind(this);
      this.score = this.score.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
// --
    }

    componentDidMount() {
        this.setState({currantQuestion: this.state.questions[this.state.currantQuestionNum]}) //ensures the correct question is loaded into state
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.gameOver && !this.state.scoreSaved){ //checks to see if the game is  over
            Firebase.database().ref('/scores').push({user: localStorage.getItem('uid'), score:this.state.score, level:this.level}); //add the users score to the db
            NotificationManager.success("Your score was saved successfully", `Added your score to the leaderboards`, 5000) //display success
            this.setState({scoreSaved:true}) //ensure the score is not saved more than once
        }
        let currentQuestion = this.state.currantQuestion;
        let correctIndex = currentQuestion.options.indexOf(currentQuestion.answer); //figure out the index of the correct answer 
        if(!this.state.gameOver && this.state.gameStarted && !this.state.displayingCorrect && this.level>0){ //checks to make sure the game is in play mode
            await sleep(1000) //wait 1 second
            if (this.state.timeLeft-1 < 0){ //checks to see if time is up
                let newStyle = this.state.styles 
                newStyle[correctIndex] = {backgroundColor: "green"}
                return this.setState({displayingCorrect:true, style:newStyle }) //if the user is out of time make the correct answer green
            } // if not done in time make the correct one green
            this.setState({timeLeft: this.state.timeLeft-1}) //update the clock on the screen 
           
        }
    }

    render() {
        if (!localStorage.getItem('uid')) return(
            <Redirect to="/login" />
          ) //check auth
        if(this.state.gameOver) return(
            <div>
              <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>
              <div class="gameBox">
                  <h2>Well done you scored {this.state.score}!!</h2>
                  <p>You have now completed Level {this.level}!</p>
                  <Link to="/dashboard"><button class="button1" >Dashboard</button> <br/></Link>
                  <Link to="/leaderboard"><button class="button1" >Leaderboard</button> <br/></Link>
              </div>
                <NotificationContainer/>
                <Back />
          </div>
          ); //game over menu


        if(!this.state.gameStarted) return(
          <div>
          
            <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>
            <div class="gameBox">
                <h2>Level {this.level}</h2>
                <p>Welcome to the game  its quite simple you will be given 10 questions and 4 answers to pick from. you have {introPage[this.level]} time per question, good luck! Press start when you are ready.</p>
                <button class="button1" onClick={() => {this.setState({gameStarted:true, timeLeft: this.time})}} >Start</button> <br/>
                <Link to="/dashboard"><button class="button1" >Back</button> <br/></Link>
            </div>
            <Back />
        </div>
        ); //game start menu
        

      return (
          <div>
        <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>
        {this.level>0 ? <this.timeLeft time={this.state.timeLeft}/> : <div />} {/*Adds a timer on the screen if the level is > than 0*/}
        <this.score score={this.state.score} />
        <div class="gameBox">
        <ProgressBar animated variant="info" now={this.state.currantQuestionNum*10   + (this.state.displayingCorrect ? (10) : (0))} label={this.state.currantQuestionNum*10+ (this.state.displayingCorrect ? (10) : (0))+"%"} /><br /> {/*the progress bar*/}
          <h2>{this.state.currantQuestion.num0} {this.state.currantQuestion.arithmetic} {this.state.currantQuestion.num1} = ?</h2>
          <button class="button2" style={this.state.styles[0]} onClick={() => {this.clickAnswer(0)}} >{this.state.currantQuestion.options[0]}</button> <br/>
          <button class="button2" style={this.state.styles[1]} onClick={() => {this.clickAnswer(1)}} >{this.state.currantQuestion.options[1]}</button> <br/>
          <button class="button2" style={this.state.styles[2]} onClick={() => {this.clickAnswer(2)}} >{this.state.currantQuestion.options[2]}</button> <br/>
          <button class="button2" style={this.state.styles[3]} onClick={() => {this.clickAnswer(3)}} >{this.state.currantQuestion.options[3]}</button>
          { this.state.displayingCorrect ? (<div><br/><br/><button class="button2" onClick={() => {this.nextQuestion()}} >Next</button></div>) : (<div />)}
          </div>
          <Back />

        </div>
      ) //game play menu
    }
  }
  function calculateQuestions(levle){
    const arithmetic = ["+","-","÷","x"] //available arithmetic
    const randomNumbers = [0, 0]; //creates a blank random number array
    const questions = []; //creates a blank questions array
    for (let index = 0; index < 10; index++) { //calculate 10 questions
        randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
        randomNumbers[1] = Math.floor((Math.random() * 12) + 1);
        //create random numbers

        let randomArithmetic = arithmetic[Math.floor((Math.random() * arithmetic.length))] //calculate a random arithmetic
        let answer = "";
        if (randomArithmetic === "+") answer = randomNumbers[0]+randomNumbers[1] //calculate the correct answer
        else if (randomArithmetic === "-"){
            answer = randomNumbers[0]-randomNumbers[1] //calculate the correct answer
            while (randomNumbers[0] < randomNumbers[1]){ //ensures the divided answer is a whole number
                randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
                randomNumbers[1] = Math.floor((Math.random() * 12) + 1);
                answer = randomNumbers[0]-randomNumbers[1]
            }
        }
        else if (randomArithmetic === "÷") {
            answer = Math.floor(randomNumbers[0]/randomNumbers[1]) //calculate the correct answer
            while (randomNumbers[0] % randomNumbers[1] !== 0){ //ensures the subtracted answer is a positive number
                randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
                randomNumbers[1] = Math.floor((Math.random() * 12) + 1);
                answer = randomNumbers[0]/randomNumbers[1]
            }
        }
        else if (randomArithmetic === "x") {answer= randomNumbers[0]*randomNumbers[1]} //calculate the correct answer
        let options = generateOptions(answer); //generates random options 
        questions.push({ //adds the question to the other questions
            num0: randomNumbers[0],
            num1: randomNumbers[1],
            arithmetic: randomArithmetic,
            options,
            answer

        })
    }
    return questions 
    }
    function generateOptions(correctAnswer){
        let createOptions = false;
        let answers = []
        let min = correctAnswer - 5
        let max = correctAnswer + 5
        if (min<0) {max=10;min=0;} //make sure the options are close to the answer
        while (!createOptions) {
            answers = []
            for (let i = 0; i < 4; i++) {
                let random = Math.floor((Math.random() * max) + min) //make sure the options are close to the answer
                let alreadyExists=false
                answers.forEach(element => {
                    if (element === random) alreadyExists = true; //ensure no random numbers are selected twice 
                    if (element === correctAnswer) alreadyExists = true; //ensure no random numbers are the same as the correct answer
                });
                if (!alreadyExists) answers.push(random) //push the number to the array
            }
        if (answers.length>3) createOptions = true; //make sure there are 4 numbers
        }
        let toPlaceAns = Math.floor((Math.random() * 4) + 0) //randomly place the correct answer within the other answers
        answers[toPlaceAns] = correctAnswer

        return answers;
    }
  
export default Game;