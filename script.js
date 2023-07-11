async function getInfo(e) {
    e.preventDefault();

    const [input, _] = e.currentTarget.elements;
    const response = await fetch(`https://api.github.com/users/${input.value}/repos`);

    if (!response.ok) {
        throw new Error("Что-то пошло не так");
    }

    const data = await response.json();
    const dataString = JSON.stringify(data);

    localStorage.setItem("repos", dataString);
    renderRepos();
}

function renderRepos() {
    const resultView = document.querySelector("#resultView")
    const items = JSON.parse(localStorage.getItem("repos"));

    resultView.innerHTML = "";

    const repoWrapper = document.createElement("div");
    repoWrapper.classList.add("repo__wrapper")

    items.map((element, _) => {
        const repoItem = document.createElement("div");
        repoItem.classList.add("repo__item");
        repoItem.textContent = element.name;
        repoWrapper.appendChild(repoItem)
    });

    resultView.appendChild(repoWrapper)
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", getInfo)
})