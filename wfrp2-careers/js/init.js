const params = new URLSearchParams(window.location.search);
let careers, talents, skills, chars

Promise.all([
    fetch('wfrp2-careers/data/en/careers.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/talents.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/skills.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/chars.json').then(res => res.json())
]).then(([_careers, _talents, _skills, _chars]) => {
    careers = _careers
    talents = _talents
    skills = _skills
    chars = _chars

    switch (params.get("type")) {
        case "career":
            el("careers-block").classList.remove("hidden")

            const cName = params.get("name") || careers[0].name
            const career = careers.filter(c => c.name === cName)[0] || {}
            openCareer(career);
            break;
        case "skill":
            el("skill-block").classList.remove("hidden")

            const sName = params.get("name") || skills[0].name
            const skill = skills.filter(c => c.name === sName)[0] || {}
            openSkill(skill)
            break;
        case "talent":
            el("talent-block").classList.remove("hidden")

            const tName = params.get("name") || talents[0].name
            const talent = talents.filter(c => c.name === tName)[0] || {}
            openTalent(talent)
            break;
        default:
            el("careers-block").classList.add("hidden")
            el("skill-block").classList.add("hidden")
            el("talent-block").classList.add("hidden")
    }

    el("search").addEventListener('input', (e) => {
        const v = e.target.value.toLowerCase();
        renderSearchResults(v ? careers.filter(i => i.name.toLowerCase().includes(v)) : []);
    });
    document.addEventListener("click", (e) => renderSearchResults([]));
})