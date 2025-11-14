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

function renderTalentList(id, arr) {
    const talentsNode = el(id);
    talentsNode.innerHTML = '';
    (arr || []).forEach(t => {
        const li = document.createElement('li');
        li.className = 'talent-item';

        if (t.includes("(")) {
            const talent = t.split("(")[0].trim()
            const spec = "(" + t.split("(")[1]
            const span = `<span>${spec}</span>`
            li.appendChild(renderTalent(talent))
            li.innerHTML += span
        } else {
            const talents = t.split(" or ").map(tt => renderTalent(tt))
            li.appendChild(talents[0])

            for (let i = 1; i < talents.length; i++) {
                li.innerHTML += `<span> or </span>`
                li.appendChild(talents[i])
            }
        }

        talentsNode.appendChild(li);
    });

}

function renderTalent(talent) {
    const div = document.createElement('span');
    div.className = 'tooltip';

    const tData = talents.filter(i => i.name.toLowerCase() === talent.toLowerCase())[0] || {}
    div.innerHTML = `<i>${talent}</i> <span class="tooltip-box"><strong>${tData.name}</strong><br><span>${tData.description}</span></span>`;

    return div;
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
        const name = document.createElement('div');
        name.innerHTML = `<strong>${k.toUpperCase()}</strong> <div class="label">${v.label}</div>`;
        row.appendChild(name);
        mp.appendChild(row);
    });

    // secondary
    const sp = el('secondary_profile');
    sp.innerHTML = '';
    Object.entries(item.secondary_profile || {}).forEach(([k, v]) => {
        const row = document.createElement('div');
        row.className = 'profile-row';
        row.innerHTML = `<div><strong>${k.toUpperCase()}</strong> <div class="label">${v.label}</div></div>`;
        sp.appendChild(row);
    });

    // lists
    renderList('skills', item.skills);

    // render talents with tooltip
    renderTalentList('talents', item.talents);
    renderCareerList('career_entries', item.career_entries);
    renderCareerList('career_exits', item.career_exits);

    // roles/roles summary
    const roles = [];
    if (item.basic) roles.push('Basic');
    if (item.special) roles.push('Special');
    if (item.advanced) roles.push('Advanced');
    el('roles').textContent = roles.length ? roles.join(' • ') : '—';
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
        div.innerHTML = `<a href="?type=career&name=${i.name}"><div class='item-title'>${i.name}</div></a>`;
        res.appendChild(div);
    });
}

function enableTalentTooltips() {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
        tooltip.addEventListener('click', (e) => {
            e.stopPropagation(); // чтобы клик не закрыл сразу
            // закрыть другие активные тултипы
            document.querySelectorAll('.tooltip.active').forEach(el => {
                if (el !== tooltip) el.classList.remove('active');
            });
            // переключить текущий
            tooltip.classList.add('active');
        });
    });

    // закрыть тултипы при клике вне
    document.addEventListener('click', () => {
        document.querySelectorAll('.tooltip.active').forEach(el => el.classList.remove('active'));
    });
}