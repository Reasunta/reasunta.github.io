const params = new URLSearchParams(window.location.search);
let careers, talents, skills, chars, localCareers, localTalents, localSkills, localChars
let UI
const localization = params.get("lang") || "ru"

el("nav-career-table").href = getLinkQuery("career")

Promise.all([
    fetch(`wfrp2-careers/data/${localization}/ui.json`).then(res => res.json()),
    fetch('wfrp2-careers/data/en/careers.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/talents.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/skills.json').then(res => res.json()),
    fetch('wfrp2-careers/data/en/chars.json').then(res => res.json()),
    fetch(`wfrp2-careers/data/${localization}/careers.json`).then(res => res.json()),
    fetch(`wfrp2-careers/data/${localization}/talents.json`).then(res => res.json()),
    fetch(`wfrp2-careers/data/${localization}/skills.json`).then(res => res.json()),
    fetch(`wfrp2-careers/data/${localization}/chars.json`).then(res => res.json())
]).then(([ui, _careers, _talents, _skills, _chars, _carLocal, _talLocal, _skLocal, _chLocal]) => {
    UI = ui
    careers = _careers;
    talents = _talents
    skills = _skills
    chars = _chars
    localCareers = _carLocal;
    localTalents = _talLocal
    localSkills = _skLocal
    localChars = _chLocal

    setLocalization(localization)

    switch (params.get("type")) {
        case "career":
            const cName = params.get("name")
            if (!cName) {
                el("careers-table-block").classList.remove("hidden")
                initCareerTable()
            }
            else {
                el("careers-block").classList.remove("hidden")
                const career = careers.filter(c => c.name === cName)[0] || {}
                const localCareer = localCareers.filter(c => c.name === cName)[0] || {}
                openCareer(career, localCareer);
            }
            break;
        case "skill":
            el("skill-block").classList.remove("hidden")

            const sName = params.get("name") || skills[0].name
            const skill = skills.filter(c => c.name === sName)[0] || {}
            const localSkill = localSkills.filter(c => c.name === sName)[0] || {}
            openSkill(skill, localSkill)
            break;
        case "talent":
            el("talent-block").classList.remove("hidden")

            const tName = params.get("name") || talents[0].name
            const talent = talents.filter(c => c.name === tName)[0] || {}
            const localTalent = localTalents.filter(c => c.name === tName)[0] || {}
            openTalent(talent, localTalent)
            break;
        default:
            el("careers-block").classList.add("hidden")
            el("skill-block").classList.add("hidden")
            el("talent-block").classList.add("hidden")
    }


    el("search").addEventListener('input', (e) => {
        const v = e.target.value.toLowerCase();
        const results = []
        results.push(...careers.filter(i => i.name.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.name, "type": "career"}}))
        results.push(...localCareers.filter(i => i.localizedName && i.localizedName.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.localizedName, "type": "career"}}))
        results.push(...talents.filter(i => i.name.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.name, "type": "talent"}}))
        results.push(...localTalents.filter(i => i.localizedName && i.localizedName.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.localizedName, "type": "talent"}}))
        results.push(...skills.filter(i => i.name.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.name, "type": "skill"}}))
        results.push(...localSkills.filter(i => i.localizedName && i.localizedName.toLowerCase().includes(v)).map(r => {return {"name": r.name, "label": r.localizedName, "type": "skill"}}))

        renderSearchResults(v ? results : []);
    });
    document.addEventListener("click", (e) => renderSearchResults([]));
})