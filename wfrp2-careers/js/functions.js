const el = id => document.getElementById(id);
const getBaseURL = () => {
    const url = new URL(window.location.href);
    url.search = "";
    return url.toString()
}
const getLinkQuery = (type, name) => {
    const lang = params.get("lang")
    const langQuery = lang ? `&lang=${lang}` : ``
    const nameQuery = name ? `&name=${name}` : ``
    return `?type=${type}${nameQuery}${langQuery}`
}
const getLangQuery = (lang) => {
    const result = [...params.keys().filter(k => k !== 'lang').map(k => `${k}=${params.get(k)}`)]
    result.push(`lang=${lang}`)
    return `?${result.join('&')}`
}

function renderSpecList(id, arr) {
    const node = el(id);
    if (arr && arr.length === 0) {
        node.classList.add("hidden")
        return
    }
    const ul = node.querySelector("ul")
    ul.innerHTML = '';
    (arr || []).forEach(x => {
        const li = document.createElement('li');
        const local = x.localizedName ? ` - ${x.localizedName}` : ""
        li.textContent = `${x.name}${local}`;
        ul.appendChild(li)
    })
}

function renderSearchResults(list) {
    let res = el("results")
    res.innerHTML = '';
    if (list.length === 0) {
        res.classList.add("hidden")
        return
    }
    res.classList.remove("hidden")
    list.forEach(i => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<a href="${getLinkQuery(i.type, i.name)}"><div class='item-title'>${i.label}</div><div class='item-type'>${i.type}</div></a>`;
        res.appendChild(div);
    });
}

function getSkillAvailability(skill) {
    const roles = [];
    if (skill.isBasic) roles.push('Basic');
    if (skill.isAdvanced) roles.push('Advanced');
    roles.push(skill.characteristic)
    return roles.length ? roles.join(' • ') : '—';
}

function setLocalization(currentLang) {
    initLangSelectbox(currentLang)

    el("search").placeholder = UI.globalSearchPlaceholder.text
    Object.entries(UI).filter(e => e[1].i18n).forEach(e => {
        if (el(`i18n-${e[0]}`)) el(`i18n-${e[0]}`).innerHTML = e[1].text || `<span style="color: yellow">${e[0]}</span>`
    })
}