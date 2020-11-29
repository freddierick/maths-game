import React from "react"
import { Link } from 'react-router-dom';
import {Back, Template} from '../rootComponents';
import {Firebase} from '../App';
import {loginHandler, register} from '../loginHandler';
import {NotificationContainer, NotificationManager} from 'react-notifications';


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

const introPage = ["unlimited","20 seconds","10 seconds"]
class Game extends React.Component {
    constructor(props) {
      super(props);
      this.level = localStorage.getItem('gameLevel');
      this.time = 0; if (this.level == 1); this.time = 20;if (this.level == 2) this.time = 10;
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
       };
       
       this.timeLeft = (props) => {
        return (
            <div class="timeBox">
            <h3>Time left:</h3>
            <strong><p>{props.time}</p></strong>
            </div>
        )
        }
        this.score = (props) => {
            return (
                <div class="scoreBox">
                    <h3>Score:</h3>
                    <p>{props.score}</p>
                </div>
            )
            }

       this.clickAnswer = (answer) => {
           if(this.state.displayingCorrect) return;
            let currentQuestion = this.state.currantQuestion;
            let correctIndex = currentQuestion.options.indexOf(currentQuestion.answer);

            if (correctIndex==answer){
                let newStyle = this.state.styles[correctIndex] = {backgroundColor: "green"}
                
                this.setState({displayingCorrect:true, style:newStyle, score: this.state.score+1000 })
            }else{
                let newStyle = this.state.styles
                newStyle[correctIndex] = {backgroundColor: "green"}
                newStyle[answer] = {backgroundColor: "red"}
                this.setState({displayingCorrect:true, style:newStyle })
            }
       }
       this.nextQuestion = () => {
           if (this.state.currantQuestionNum+1 == this.state.questions.length) return this.setState({gameOver:true}) 
            this.setState({currantQuestionNum: this.state.currantQuestionNum+1, currantQuestion: this.state.questions[this.state.currantQuestionNum+1],styles:[{},{},{},{}],displayingCorrect:false, timeLeft: this.time})
         }

      this.handleChange = this.handleChange.bind(this);
      this.clickAnswer = this.clickAnswer.bind(this);
      this.calculateQuestions = calculateQuestions.bind(this);
      this.score = this.score.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})
      }

    componentDidMount() {
        this.setState({currantQuestion: this.state.questions[this.state.currantQuestionNum]})
        
    }
    async componentDidUpdate(prevProps, prevState) {
        if (this.state.gameOver && !this.state.scoreSaved){
            Firebase.database().ref('/scores').push({user: localStorage.getItem('uid'), score:this.state.score, level:this.level});
            NotificationManager.success("Your score was saved successfully", `Added your score to the leaderboards`, 5000)
            this.setState({scoreSaved:true})
        }
        let currentQuestion = this.state.currantQuestion;
        let correctIndex = currentQuestion.options.indexOf(currentQuestion.answer);
        if(!this.state.gameOver && this.state.gameStarted && !this.state.displayingCorrect && this.level>0){
            await sleep(1000)
            if (this.state.timeLeft-1 < 0){
                let newStyle = this.state.styles
                newStyle[correctIndex] = {backgroundColor: "green"}
                return this.setState({displayingCorrect:true, style:newStyle })
            } // if not done in time make the correct one green
            this.setState({timeLeft: this.state.timeLeft-1}) 
           
        }
    }

    render() {
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
          );


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
        );
        

      return (
          <div>
        <h1 style={{textAlign: "center"}} styles="font-family: 'Lucida Console', Courier, monospace;">Mic The Monkeys  Maths Mayhem</h1>
        {this.level>0 ? <this.timeLeft time={this.state.timeLeft}/> : <div />} {/*Adds a timer on the screen if the level is > than 0*/}
        <this.score score={this.state.score} />
        <div class="gameBox">
          <h2>{this.state.currantQuestion.num0} {this.state.currantQuestion.arithmetic} {this.state.currantQuestion.num1} = ?</h2>
          <button class="button2" style={this.state.styles[0]} onClick={() => {this.clickAnswer(0)}} >{this.state.currantQuestion.options[0]}</button> <br/>
          <button class="button2" style={this.state.styles[1]} onClick={() => {this.clickAnswer(1)}} >{this.state.currantQuestion.options[1]}</button> <br/>
          <button class="button2" style={this.state.styles[2]} onClick={() => {this.clickAnswer(2)}} >{this.state.currantQuestion.options[2]}</button> <br/>
          <button class="button2" style={this.state.styles[3]} onClick={() => {this.clickAnswer(3)}} >{this.state.currantQuestion.options[3]}</button>
          { this.state.displayingCorrect ? (<div><br/><br/><button class="button2" onClick={() => {this.nextQuestion()}} >Next</button></div>) : (<div />)}
          </div>
          <Back />

        </div>
      )
    }
  }
  function calculateQuestions(levle){
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    const arithmetic = ["+","-","÷","x"]
    const randomNumbers = [0, 0];
    const questions = [];
    for (let index = 0; index < 10; index++) {
        randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
        randomNumbers[1] = Math.floor((Math.random() * 12) + 1);

        let randomArithmetic = arithmetic[Math.floor((Math.random() * arithmetic.length))]
        let answer = "";
        if (randomArithmetic == "+") answer = randomNumbers[0]+randomNumbers[1]
        else if (randomArithmetic == "-"){
            answer = randomNumbers[0]-randomNumbers[1]
            while (randomNumbers[0] < randomNumbers[1]){
                randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
                randomNumbers[1] = Math.floor((Math.random() * 12) + 1);
                answer = randomNumbers[0]-randomNumbers[1]
            }
        }
        else if (randomArithmetic == "÷") {
            answer = Math.floor(randomNumbers[0]/randomNumbers[1])
            while (randomNumbers[0] % randomNumbers[1] != 0){
                randomNumbers[0] = Math.floor((Math.random() * 12) + 1);
                randomNumbers[1] = Math.floor((Math.random() * 12) + 1);
                answer = randomNumbers[0]/randomNumbers[1]
            }
        }
        else if (randomArithmetic == "x") {answer= randomNumbers[0]*randomNumbers[1]}
        let options = generateOptions(answer);
        questions.push({
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
        if (min<0) {max=10;min=0;}
        while (!createOptions) {
            answers = []
            for (let i = 0; i < 4; i++) {
                let random = Math.floor((Math.random() * max) + min)
                let alreadyExists=false
                answers.forEach(element => {
                    if (element === random) alreadyExists = true;
                    if (element === correctAnswer) alreadyExists = true;
                });
                if (!alreadyExists) answers.push(random)
            }
        if (answers.length>3) createOptions = true;
        // createOptions = true;
        }
        let toPlaceAns = Math.floor((Math.random() * 4) + 0)
        answers[toPlaceAns] = correctAnswer

        return answers;
    }
  
export default Game;