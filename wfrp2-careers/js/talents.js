function openTalent(item, local) {
    el('talent-name').textContent = item.name;
    el('talent-localized-name').textContent = local.localizedName ? ` - ${local.localizedName}` : "";
    el('talentDescription').textContent = local.description || item.description;
    renderSpecList('talentSpecs', local.specs || item.specs || [])
}

function initTalentTable() {
    const nameRenderer = (_instance, td, _row, _col, _prop, value) => {
        td.innerHTML = `<a href="${getLinkQuery("talent", value.name)}"><i>${value.localizedName}</i></a>`;
    };
    const container = document.querySelector('#talent-table');
    const data = talents.map(t => {
        const local = localTalents.filter(lt => lt.name === t.name)[0]
        t.localizedName = local.localizedName || local.name;
        t.description = local.description
        return t
    })

    const hot = new Handsontable(container, {
        themeName: 'ht-theme-main',
        language: UI.handsontableLocale.text,
        data: data,
        width: '100%',
        height: 'auto',
        columns: [
            {title: UI.talentTableHeadersName.text, type: 'text', data: (rd) => rd, renderer: nameRenderer},
            {title: UI.talentTableHeadersDesc.text, type: 'text', data: 'description'},
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
        const name = el("name-talent-table-filter").value

        const filtered = data
            .filter(d => d.localizedName.toLowerCase().includes(name.toLowerCase()) || d.name.toLowerCase().includes(name.toLowerCase()))
        hot.loadData(filtered);
    }
    el("name-talent-table-filter").addEventListener('keyup', filterTable);
}