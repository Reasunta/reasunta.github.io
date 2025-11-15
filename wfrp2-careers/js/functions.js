const el = id => document.getElementById(id);
const getBaseURL = () => {
    const url = new URL(window.location.href);
    url.search = "";
    return url.toString()
}

function renderList(id, arr) {
    const node = el(id);
    node.innerHTML = '';
    (arr || []).forEach(x => {
        const li = document.createElement('li');
        li.textContent = x;
        node.appendChild(li)
    })
}

function renderCareerList(id, arr) {
    const node = el(id);
    node.innerHTML = '';
    (arr || []).forEach(x => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = getBaseURL() + `?type=career&name=${x}`
        a.innerHTML = `<i>${x}</i>`;
        li.appendChild(a)
        node.appendChild(li)
    })
}

function parseTalentOrSkill(input) {
    const differOR = input.replace(/\(([^)]+)\)/g, (match, inner) => {
        return match.replace(/\bor\b/g, 'OR');
    })
    return differOR.split(" or ")
}

function renderTooltipList(id, arr, tooltipFunc) {
    const talentsNode = el(id);
    talentsNode.innerHTML = '';
    (arr || []).forEach(t => {
        const li = document.createElement('li');
        li.className = 'tooltip-item';

        const talents = parseTalentOrSkill(t).map(tt => renderTooltip(tt, tooltipFunc))
        li.appendChild(talents[0])

        for (let i = 1; i < talents.length; i++) {
            li.innerHTML += `<span> or </span>`
            li.appendChild(talents[i])
        }

        talentsNode.appendChild(li);
    });
}

function renderTooltip(row, tooltipFunc) {
    const div = document.createElement('span');
    div.className = 'tooltip';
    div.innerHTML = tooltipFunc(row);

    return div;
}

const talentTooltip = (talent) => {
    const talentWithoutBrackets = talent.split("(")[0].trim()
    const tData = talents.filter(i => i.name.toLowerCase() === talentWithoutBrackets.toLowerCase())[0] || {}
    return `<i>${talent.replace("OR", "or")}</i><span class="tooltip-box"><strong>${tData.name}</strong><br><span>${tData.description}</span></span>`
}

const skillTooltip = (skill) => {
    const skillWithoutBrackets = skill.split("(")[0].trim()
    const sData = skills.filter(i => i.name.toLowerCase() === skillWithoutBrackets.toLowerCase())[0] || {}
    return `<i>${skill.replace("OR", "or")}</i> <span class="tooltip-box"><strong>${sData.name}</strong><br><i><span>${sData.characteristic}</span></i><br><br><span>${sData.description}</span></span>`
}

function openCareer(item) {
    el('name').textContent = item.name;
    el('quote').textContent = item.quote;
    el('description').textContent = item.description;
    el('requirements').textContent = item.requirements;
    if (!item.requirements) el('requirements').classList.add("hidden")

    // trappings
    const trap = el('trappings');
    trap.innerHTML = '';
    (item.trappings || []).forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        trap.appendChild(li)
    });

    // main_profile
    const mp = el('main_profile');
    mp.innerHTML = '';
    Object.entries(item.main_profile || {}).forEach(([k, v]) => {
        const row = document.createElement('div');
        row.className = 'profile-row';
        const inner = document.createElement('div');
        inner.className = "tooltip"
        const char = chars.filter(ch => ch.short === k.toUpperCase())[0] || {}
        inner.innerHTML = `<strong>${k.toUpperCase()}</strong><span class="tooltip-box"><strong>${char.name}</strong><br><span>${char.description}</span></span><div class="label">${v.label}</div>`;
        row.appendChild(inner);
        mp.appendChild(row);
    });

    // secondary
    const sp = el('secondary_profile');
    sp.innerHTML = '';
    Object.entries(item.secondary_profile || {}).forEach(([k, v]) => {
        const row = document.createElement('div');
        row.className = 'profile-row';
        const inner = document.createElement('div');
        inner.className = "tooltip"
        const char = chars.filter(ch => ch.short.toUpperCase() === k.toUpperCase())[0] || {}
        inner.innerHTML = `<strong>${k.toUpperCase()}</strong><span class="tooltip-box"><strong>${char.name}</strong><br><span>${char.description}</span></span><div class="label">${v.label}</div>`;
        row.appendChild(inner);
        sp.appendChild(row);
    });

    // lists
    renderTooltipList('skills', item.skills, skillTooltip);

    // render talents with tooltip
    renderTooltipList('talents', item.talents, talentTooltip);
    renderCareerList('career_entries', item.career_entries);
    renderCareerList('career_exits', item.career_exits);

    // roles/roles summary
    el('roles').textContent = getCareerType(item);
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
        div.innerHTML = `<a href="?type=career&name=${i.name}"><div class='item-title'>${i.name}</div><div class='item-type'>${getCareerType(i)}</div></a>`;
        res.appendChild(div);
    });
}

function getCareerType(career) {
    const roles = [];
    if (career.basic) roles.push('Basic');
    if (career.special) roles.push('Special');
    if (career.advanced) roles.push('Advanced');
    return roles.length ? roles.join(' • ') : '—';
}