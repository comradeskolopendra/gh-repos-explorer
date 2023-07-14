import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
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

const db = getFirestore(firebaseApp);

const citiesRef = collection(db, "cities");
const docsSnap = await getDocs(citiesRef);
docsSnap.forEach((doc) => console.log(doc.data()));
const mockData = { country: "Kazakhstan", name: "Almaty", province: "Almaty" };
addDoc(citiesRef, mockData)
  .then((docRef) => console.log(docRef.id))
  .catch((err) => console.log(err));

async function getInfo(e) {
  e.preventDefault();

  const [input, _] = e.currentTarget.elements;
  const response = await fetch(
    `https://api.github.com/users/${input.value}/repos`
  );

  if (!response.ok) {
    throw new Error("Что-то пошло не так");
  }

  const data = await response.json();
  const dataString = JSON.stringify(data);

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
