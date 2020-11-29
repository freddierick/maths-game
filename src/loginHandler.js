import {Firebase} from './App';

function loginHandler(email, password){
    return new Promise( (res,rej) => {
            Firebase.auth().signInWithEmailAndPassword(email, password)
            
        .then((user) => {
            Firebase.database().ref('/users/' + user.user.uid).once('value').then((snapshot) => { //logs user in and fetches data from DB
                localStorage.setItem('uid', user.user.uid)
                localStorage.setItem('username',snapshot.node_.children_.root_.value.value_)
                res()
            });

            
        })
        .catch((error) => {
            rej(error)
        });
    });
}

function register(email, password, username){
    return new Promise( (res,rej) => {
            Firebase.auth().createUserWithEmailAndPassword(email, password) //creates user and adds data to DB
        .then((user) => {
            Firebase.database().ref("/users/"+user.user.uid).set({username});
            localStorage.setItem('uid',user.user.uid)
            localStorage.setItem('username',username)
            res();
        })
        .catch((error) => {
            rej(error)
        });
    });
}

export {loginHandler, register}; 