import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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

let ghUsersRef;

async function deleteUser(collection, id) {
  return await deleteDoc(doc(db, collection, id));
}

async function addUser(ref, obj) {
  return addDoc(ref, obj);
}

async function getInfo(e) {
  e.preventDefault();

  const userObj = {
    nickname: null,
    url_gh: null,
    repos: null,
    avatar_url: null,
  };

  const [input, _] = e.currentTarget.elements;

  await fetch(`https://api.github.com/users/${input.value}/repos`)
    .then((resp) => resp.json())
    .then((data) => {
      userObj.repos = data;
    })
    .catch((err) => {
      throw new Error(err);
    });

  await fetch(`https://api.github.com/users/${input.value}`)
    .then((resp) => resp.json())
    .then((data) => {
      userObj.nickname = data.login;
      userObj.avatar_url = data.avatar_url;
      userObj.url_gh = `https://github.com/${input.value}`;
    })
    .catch((err) => {
      throw new Error(err);
    });

  addUser(ghUsersRef, userObj)
  changeUsersHistory();

  renderRepos(userObj.repos);
}

async function changeUsersHistory() {
  const allUsers = await getDocs(ghUsersRef);
  const historyView = document.querySelector("#history");
  historyView.innerHTML = "";
  allUsers.forEach((element) => {
    historyView.innerHTML += `<a href="${element.data().url_gh}">${
      element.data().nickname
    }</a>`;
  });
}

async function renderRepos(items) {
  const resultView = document.querySelector("#resultView");
  console.log(items);

  resultView.innerHTML = "";

  const repoWrapper = document.createElement("div");
  repoWrapper.classList.add("repo__wrapper");

  items.forEach((element, _) => {
    const template = `
            <div class="repo__item">
                <a href="${element.html_url}" class="repo__link" target="_blank">${element.name}</a>
                <img src="${element.owner.avatar_url}" class="avatar"/>
            </div>
        `;

    repoWrapper.innerHTML += template;
  });

  resultView.appendChild(repoWrapper);
}

window.addEventListener("DOMContentLoaded", async (event) => {
  initFirebaseCollection(event);

  const form = document.querySelector("form");
  form.addEventListener("submit", getInfo);
});

async function initFirebaseCollection(e) {
  e.preventDefault();
  ghUsersRef = collection(db, "gh-users");
}
