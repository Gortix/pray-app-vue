const productionFirebaseConfig = {
  apiKey: "AIzaSyBPadQ_aiYVLLjONahtyZWw9V96pFfnApI",

  authDomain: "modlitwy-dzialdowo.firebaseapp.com",

  databaseURL:
    "https://modlitwy-dzialdowo-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "modlitwy-dzialdowo",

  storageBucket: "modlitwy-dzialdowo.appspot.com",

  messagingSenderId: "1008530903917",

  appId: "1:1008530903917:web:0b658a162cbfd303a44064",

  measurementId: "G-96MYD426QP",
};

const developmentFirebaseConfig = {
  apiKey: "AIzaSyAV9MZw63cJubTUMj8C6bm5G5xTn4s847c",

  authDomain: "pray-app-dzialodow.firebaseapp.com",

  databaseURL:
    "https://pray-app-dzialodow-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId: "pray-app-dzialodow",

  storageBucket: "pray-app-dzialodow.appspot.com",

  messagingSenderId: "817782987044",

  appId: "1:817782987044:web:1adeb2e41ac9e4246a7bb1",
};

// eslint-disable-next-line
export default process.env.VUE_APP_FIREBASE_PROD == "true"
  ? productionFirebaseConfig
  : developmentFirebaseConfig;
