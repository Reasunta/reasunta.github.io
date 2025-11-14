const params = new URLSearchParams(window.location.search);

if (params.get("name") && params.get("type") === "career") {
    el("backBtn").href = getBaseURL();
    el("search-block").classList.add("hidden")
    el("careers-block").classList.remove("hidden")

    const cName = params.get("name") || "Abbot"
    const career = data.filter(c => c.name === cName)[0] || {}
    openCareer(career);
} else {
    el("search-block").classList.remove("hidden")
    el("careers-block").classList.add("hidden")
}

enableTalentTooltips(); // <-- активируем клики
el("search").addEventListener('input', (e) => {
    const v = e.target.value.toLowerCase();
    renderSearchResults(v ? data.filter(i => i.name.toLowerCase().includes(v)) : []);
});