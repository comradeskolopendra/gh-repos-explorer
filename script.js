import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuBBIZe6gaGfiyQ4btKUHD3A7F85iJI0A",
  authDomain: "gh-repos-explorer.firebaseapp.com",
  projectId: "gh-repos-explorer",
  storageBucket: "gh-repos-explorer.appspot.com",
  messagingSenderId: "199790957337",
  appId: "1:199790957337:web:d64bc11a00f4e89bbeab88",
};

const firebaseApp = initializeApp(firebaseConfig);

// Database
const db = getFirestore(firebaseApp);
const citiesRef = collection(db, "cities");

// Показать данные
// const docsSnap = await getDocs(citiesRef);
// docsSnap.forEach((element) => console.log(element.data()));


// Добавление
// addDoc(citiesRef, { country: "Kazakhstan", name: "Almaty", province: "Almaty" })
//   .then((docRef) => console.log(docRef.id))
//   .catch((err) => console.log(err));


// Удалить данные
// await deleteDoc(doc(db, "cities", id));

// TODO: 
//    1. Delete all users;
//    2. Refactor deleteDoc function to snap ref without doc func; - done
//    3. Remove error with hot reload after get collection;

const ghUsersRef = collection(db, "gh-users");
const ghUsersSnap = await getDocs(ghUsersRef);

// async function deleteUser(collection, id) {
//   return await deleteDoc(doc(db, collection, id));
// }

// function addUser(ref, obj) {
//   return addDoc(ref, obj);
// }

// onSnapshot(ghUsersRef, () => {
//   event.preventDefault();
// })

async function getInfo(e) {

  console.log("start");
  e.preventDefault();
  
  const userObj = {
    nickname: null,
    url_gh: null,
    avatar_url: null,
    repos: null
  }

  const [input, _] = e.currentTarget.elements;
  const response = await fetch(
    `https://api.github.com/users/${input.value}/repos`
  );

  if (!response.ok) {
    throw new Error("Что-то пошло не так");
  }

  const data = await response.json();
  const dataString = JSON.stringify(data);
  
  for (let key of Object.keys(userObj)) {
    // userObj[key] = 
  }

  localStorage.setItem("repos", dataString);
  renderRepos();
}

function renderRepos() {
  const resultView = document.querySelector("#resultView");
  const items = JSON.parse(localStorage.getItem("repos"));

  resultView.innerHTML = "";

  const repoWrapper = document.createElement("div");
  repoWrapper.classList.add("repo__wrapper");

  items.map((element, _) => {
    const template = `
            <div class="repo__item">
                <a href="${element.html_url}" class="repo__link" target="_blank">${element.name}</a>
                <img src="${element.owner.avatar_url}" class="avatar"/>
            </div>
        `;

    repoWrapper.innerHTML += template;
  });

  resultView.appendChild(repoWrapper);
  console.log(items);
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", getInfo);
});
