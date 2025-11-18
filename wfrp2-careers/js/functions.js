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

function renderList(id, arr) {
    const node = el(id);
    node.innerHTML = '';
    (arr || []).forEach(x => {
        const li = document.createElement('li');
        li.textContent = x;
        node.appendChild(li)
    })
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

function renderCareerList(id, arr) {
    const node = el(id);
    node.innerHTML = '';
    (arr || []).forEach(x => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const label = (x.specs && x.specs.length) ? `${x.name} (${x.specs.join(", ")})` : x.name

        if (careers.filter(c => c.name === x.name).length) {
            a.href = getBaseURL() + getLinkQuery("career", x.name)
            a.innerHTML = `<i>${label}</i>`;
        } else {
            a.innerHTML = `${label}`;
        }
        li.appendChild(a)
        node.appendChild(li)
    })
}

function renderTooltipList(id, arr, tooltipFunc) {
    const talentsNode = el(id);
    talentsNode.innerHTML = '';
    (arr || []).forEach(itemOptions => {
        const li = document.createElement('li');
        li.className = 'tooltip-item';

        const talents = itemOptions.map(option => renderTooltip(option, tooltipFunc))
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
    const tData = talents.filter(i => i.name.toLowerCase() === talent.name.toLowerCase())[0] || {}
    const localTData = localTalents.filter(i => i.name.toLowerCase() === talent.name.toLowerCase())[0] || {}
    let label = talent.name
    const tooltipTName = localTData.localizedName || tData.name
    const tooltipTDesc = localTData.description || tData.description

    if (talent.specs) label += ` (${talent.specs})`
    return `<a href="${getLinkQuery("talent", talent.name)}"><i>${label}</i><span class="tooltip-box"><strong>${tooltipTName}</strong><br><span>${tooltipTDesc}</span></span></a>`
}

const skillTooltip = (skill) => {
    const sData = skills.filter(i => i.name.toLowerCase() === skill.name.toLowerCase())[0] || {}
    const localSData = localSkills.filter(i => i.name.toLowerCase() === skill.name.toLowerCase())[0] || {}
    let label = skill.name
    const tooltipSName = localSData.localizedName || sData.name
    const tooltipSDesc = localSData.description || sData.description
    if (skill.specs) label += ` (${skill.specs})`
    return `<a href="${getLinkQuery("skill", skill.name)}"><i>${label}</i> <span class="tooltip-box"><strong>${tooltipSName}</strong><br><i><span>${sData.characteristic}</span></i><br><br><span>${tooltipSDesc}</span></span></a>`
}

function openCareer(item, local) {
    el('name').textContent = item.name;
    el('localized-name').textContent = local.localizedName ? ` - ${local.localizedName}` : "";
    el('quote').textContent = local.quote || item.quote;
    el('description').textContent = local.description || item.description;
    el('requirements').textContent = local.requirements || item.requirements;
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
        const char = chars.filter(ch => ch.short.toUpperCase() === k.toUpperCase())[0] || {}
        const localChar = localChars.filter(ch => ch.short.toUpperCase() === k.toUpperCase())[0] || {}

        const label = v.value > 0 ? `+${v.value}%` : v.value < 0 ? `${v.value}%` : "–"
        inner.innerHTML = `<strong>${k.toUpperCase()}</strong><span class="tooltip-box tooltip-right"><strong>${localChar.localizedName || char.name}</strong><br><span>${localChar.description || char.description}</span></span><div class="label">${label}</div>`;
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
        const localChar = localChars.filter(ch => ch.short.toUpperCase() === k.toUpperCase())[0] || {}
        const label = v.value > 0 ? `+${v.value}` : v.value < 0 ? v.value : "–"
        inner.innerHTML = `<strong>${k.toUpperCase()}</strong><span class="tooltip-box tooltip-left"><strong>${localChar.localizedName || char.name}</strong><br><span>${localChar.description || char.description}</span></span><div class="label">${label}</div>`;
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
    el('roles').textContent = getCareerAvailability(item);
}

function openSkill(item, local) {
    el('skill-name').textContent = item.name;
    el('skill-localized-name').textContent = local.localizedName ? ` - ${local.localizedName}` : "";
    el('skillDescription').textContent = local.description || item.description;
    el('skillRoles').textContent = getSkillAvailability(item);
    renderSpecList('skillSpecs', local.specs || item.specs || [])
}

function openTalent(item, local) {
    el('talent-name').textContent = item.name;
    el('talent-localized-name').textContent = local.localizedName ? ` - ${local.localizedName}` : "";
    el('talentDescription').textContent = local.description || item.description;
    renderSpecList('talentSpecs', local.specs || item.specs || [])
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
        div.innerHTML = `<a href="?type=career&name=${i.name}"><div class='item-title'>${i.name}</div><div class='item-type'>${getCareerAvailability(i)}</div></a>`;
        res.appendChild(div);
    });
}

function getCareerAvailability(career) {
    const roles = [];
    if (career.basic) roles.push('Basic');
    if (career.special) roles.push('Special');
    if (career.advanced) roles.push('Advanced');
    return roles.length ? roles.join(' • ') : '—';
}

function getSkillAvailability(skill) {
    const roles = [];
    if (skill.isBasic) roles.push('Basic');
    if (skill.isAdvanced) roles.push('Advanced');
    roles.push(skill.characteristic)
    return roles.length ? roles.join(' • ') : '—';
}

function initCareerTable() {
    const nameRenderer = (_instance, td, _row, _col, _prop, value) => {
        td.innerHTML = `<a href="${getLinkQuery("career", value.name)}"><i>${value.localizedName}</i></a>`;
    };
    const primaryCharRenderer = (_instance, td, _row, _col, _prop, value) => {
        td.classList.add('htCenter')
        td.innerHTML = value > 0 ? `+${value}%` : value < 0 ? `${value}%` : '-';
    };
    const secondaryCharRenderer = (_instance, td, _row, _col, _prop, value) => {
        td.classList.add('htCenter')
        td.innerHTML = value > 0 ? `+${value}` : value < 0 ? value : '-';
    };

    const container = document.querySelector('#career-table');
    const data = careers.map(c => {
        const local = localCareers.filter(lc => lc.name === c.name)[0]
        c.localizedName = local.localizedName || local.name;
        return c
    })

    new Handsontable(container, {
        themeName: 'ht-theme-main',
        data: data,
        width: '100%',
        height: 'auto',
        columns: [
            {title: 'Name', type: 'text', data: (rd) => rd, renderer: nameRenderer},
            {title: 'Basic', type: 'checkbox', data: 'basic', className: 'htCenter'},
            {title: 'Special', type: 'checkbox', data: 'special', className: 'htCenter'},
            ...chars.filter(ch => ch.profile === 'main').map(ch => {
                return {
                    title: ch.short,
                    type: 'numeric',
                    data: `main_profile.${ch.short.toLowerCase()}.value`,
                    renderer: primaryCharRenderer,
                }
            }),
            ...chars.filter(ch => ch.profile === 'secondary').map(ch => {
                return {
                    title: ch.short,
                    type: 'numeric',
                    data: `secondary_profile.${ch.short.toLowerCase()}.value`,
                    renderer: secondaryCharRenderer
                }
            }),
        ],
        //columnSorting: true,
        colHeaders: true,
        rowHeaders: true,
        stretchH: 'all',
        readOnly: true,
        pagination: true,
        filters: true,
        //dropdownMenu: true,
        licenseKey: 'non-commercial-and-evaluation',
    });
}