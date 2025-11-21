function openSkill(item, local) {
    el('skill-name').textContent = item.name;
    el('skill-localized-name').textContent = local.localizedName ? ` - ${local.localizedName}` : "";
    el('skillDescription').textContent = local.description || item.description;
    el('skillRoles').textContent = getSkillAvailability(item);
    renderSpecList('skillSpecs', local.specs || item.specs || [])
}

function initSkillTable() {
    const nameRenderer = (_instance, td, _row, _col, _prop, value) => {
        td.innerHTML = `<a href="${getLinkQuery("skill", value.name)}"><i>${value.localizedName}</i></a>`;
    };
    const container = document.querySelector('#skill-table');
    const data = skills.map(s => {
        const local = localSkills.filter(ls => ls.name === s.name)[0]
        s.localizedName = local.localizedName || local.name;
        s.description = local.description
        return s
    })

    const hot = new Handsontable(container, {
        themeName: 'ht-theme-main',
        language: UI.handsontableLocale.text,
        data: data,
        width: '100%',
        height: 'auto',
        columns: [
            {title: UI.skillTableHeadersName.text, type: 'text', data: (rd) => rd, renderer: nameRenderer},
            {title: UI.skillTableHeadersDesc.text, type: 'text', data: 'description'},
        ],
        colWidths: [20, 80],
        colHeaders: true,
        rowHeaders: true,
        stretchH: 'all',
        readOnly: true,
        pagination: {
            pageSize: 5
        },
        licenseKey: 'non-commercial-and-evaluation',
    });

    const filterTable = () => {
        const name = el("name-skill-table-filter").value

        const filtered = data
            .filter(d => d.localizedName.toLowerCase().includes(name.toLowerCase()) || d.name.toLowerCase().includes(name.toLowerCase()))
        hot.loadData(filtered);
    }
    el("name-skill-table-filter").addEventListener('keyup', filterTable);
}