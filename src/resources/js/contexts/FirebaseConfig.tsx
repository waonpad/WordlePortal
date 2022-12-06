import firebase from 'firebase/compat/app';
// 認証周りやDB周りで必要なためimportしておく
import 'firebase/compat/auth';
import 'firebase/compat/database';

// コピーしてきたfirebaseConfigそのまま
// 元がvarで宣言されているので、constに変更
const firebaseConfig = {
    apiKey: "AIzaSyCh83qNlts9p1924Rj8lmXWjdw-G9wU1pM",
    authDomain: "wordleportal.firebaseapp.com",
    databaseURL: "https://wordleportal-default-rtdb.firebaseio.com",
    projectId: "wordleportal",
    storageBucket: "wordleportal.appspot.com",
    messagingSenderId: "766898211743",
    appId: "1:766898211743:web:e3a0fcf1ec9e67fba34baa",
    measurementId: "G-4FTET7QZZZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp;