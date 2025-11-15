const params = new URLSearchParams(window.location.search);

if (params.get("type") === "career") {
    //el("search-block").classList.add("hidden")
    el("careers-block").classList.remove("hidden")

    const cName = params.get("name") || "Abbot"
    const career = careers.filter(c => c.name === cName)[0] || {}
    openCareer(career);
} else {
    //el("search-block").classList.remove("hidden")
    el("careers-block").classList.add("hidden")
}

el("search").addEventListener('input', (e) => {
    const v = e.target.value.toLowerCase();
    renderSearchResults(v ? careers.filter(i => i.name.toLowerCase().includes(v)) : []);
});