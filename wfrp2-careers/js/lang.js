const switcher = document.getElementById("lang-switcher");
const dropdown = switcher.querySelector(".lang-dropdown");
const currentLang = switcher.querySelector(".current-lang");

const currentLangLabel = (text) => `<span class="label">${text.toUpperCase()}</span>`
const langOptionLabel = (lang, text) => `<a href="${getLangQuery(lang)}"><li>${text}</li></a>`
const langOptions = ["ru", "en"]

function initLangSelectbox(currentLangText) {
    currentLang.innerHTML = currentLangLabel(currentLangText)
    langOptions.forEach(opt => {
        dropdown.innerHTML += langOptionLabel(opt, opt)
    })

    switcher.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });
    document.addEventListener("click", e => {
        if (!switcher.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}

