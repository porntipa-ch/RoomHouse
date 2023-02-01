import * as firebase from 'firebase';
import '@firebase/firestore';
import "firebase/auth";
import "firebase/firestore";
require("firebase/firestore");


const firebaseConfig = {
    apiKey: "AIzaSyC7GFxGR9TKQuIfB0ERcPF7FpwT13Z-wRw",
    authDomain: "roomhouse.firebaseapp.com",
    databaseURL: "https://roomhouse-default-rtdb.firebaseio.com",
    projectId: "roomhouse",
    storageBucket: "roomhouse.appspot.com",
    messagingSenderId: "338295866772",
    appId: "1:338295866772:web:eb8deca306e21a6c593b81",
    measurementId: "G-YFQCM6K72P"
  };

  
  let app;
  if(firebase.apps.length===0){
    app=firebase.initializeApp(firebaseConfig);
  }else{
    app=firebase.app();
  }
  const db=app.firestore();
  const auth=firebase.auth();

  export{db,auth};
  // export default firebase;