import React from "react";
import {Firebase} from './App';

function loginHandler(email, password){
    return new Promise( (res,rej) => {
            Firebase.auth().signInWithEmailAndPassword(email, password)
            
        .then((user) => {
            Firebase.database().ref('/users/' + user.user.uid).once('value').then((snapshot) => {
                localStorage.setItem('uid', user.user.uid)
                localStorage.setItem('username',snapshot.node_.children_.root_.value.value_)
                res()
            });

            
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            rej(error)
        });
    });
}

function register(email, password, username){
    return new Promise( (res,rej) => {
            Firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            Firebase.database().ref("/users/"+user.user.uid).set({username});
            localStorage.setItem('uid',user.user.uid)
            localStorage.setItem('username',username)
            res();
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..

            rej(error)
        });
    });
}






 function writeUserData(){
    Firebase.database()
      .ref("/")
      .set(this.state);
  };

  function getUserData(){
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

export {loginHandler, register}; 