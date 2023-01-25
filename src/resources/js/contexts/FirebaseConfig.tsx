import firebase from 'firebase/compat/app';
// 認証周りやDB周りで必要なためimportしておく
import 'firebase/compat/auth';
import 'firebase/compat/database';

// コピーしてきたfirebaseConfigそのまま
// 元がvarで宣言されているので、constに変更
const firebaseConfig = {
    apiKey: process.env.MIX_FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.MIX_FIREBASE_CONFIG_AUTH_DOMAIN,
    databaseURL: process.env.MIX_FIREBASE_CONFIG_DATABASE_URL,
    projectId: process.env.MIX_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.MIX_FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.MIX_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.MIX_FIREBASE_CONFIG_APP_ID,
    measurementId: process.env.MIX_FIREBASE_CONFIG_MEASUREMENT_ID
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp;