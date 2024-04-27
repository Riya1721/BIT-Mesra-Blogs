// import { initializeApp } from "firebase/app";
// import { getFirestore } from "@firebase/firestore"
// import { getStorage } from "@firebase/storage"
// import { getAuth } from "@firebase/auth"

// const firebaseConfig = {
//     apiKey: "AIzaSyD_v3WYA1f4ltiKkJJOShUWPGRn-hrFlLY",
//     authDomain: "blog-app-7b411.firebaseapp.com",
//     projectId: "blog-app-7b411",
//     storageBucket: "blog-app-7b411.appspot.com",
//     messagingSenderId: "352027614829",
//     appId: "1:352027614829:web:c7e0642fb058d5fea4a964",
//     measurementId: "G-EXKBHGB3LC"
//   };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCKoBU-FtKfTbd1T59wFVcN6MA67mipGg",
  authDomain: "bitblogs-62423.firebaseapp.com",
  projectId: "bitblogs-62423",
  storageBucket: "bitblogs-62423.appspot.com",
  messagingSenderId: "880138135475",
  appId: "1:880138135475:web:b9ba1c041543622a874dc6",
  measurementId: "G-WKZNVMLCF6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
