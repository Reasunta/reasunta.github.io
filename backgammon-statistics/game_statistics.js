class GameStatistics {
    constructor(parent_dom) {
        this.stats = {
            turns: "T",
            total: "\u2211<small>roll</small>",
            mean: "M<sub>roll</sub>",
            doubles: "\u039D<sub>dbl</sub>",
            max_doubles: "N<sub>max dbl</sub>"
        }

        this.template =
        '<h3>Статистика партий</h3>' +
        '<table class="table table-striped table-hover text-center" id="statistics_table">' +
        '<thead class="head-center"></thead>' +
        '<tbody></tbody></table>';

        this.row_template = '<tr><td name="player" class="col-sm-2"></td></tr>';

        this.dom = $(this.template);

        let head = $('<tr><th>#</th></tr>');
        Object.keys(this.stats).forEach(stat => head.append($(`<th>${this.stats[stat]}</th>`)))
        this.dom.find("thead").append(head);

        parent_dom.empty();
        parent_dom.append(this.dom);
    }

    countPlayerStats = function(data) {
        if(data.length % 2) data.pop();

        let result = {
            total: 0,
            doubles: 0,
            turns: 0,
            max_doubles: 0
        };

        for(let i = 0; i < data.length; i += 2) {
            result.total += data[i] == data[i + 1] ? 4 * data[i]  : data[i] + data[i + 1];
            result.doubles += Number(data[i] == data[i + 1])
            result.turns++;
        }

        result.mean = ((result.total / result.turns) || 0).toFixed(2);

        return result;
    }

    renderGame = function(tbody, game) {
        let last_row = undefined;

        for(let player in game.game) {
            let stats = this.countPlayerStats(game.game[player]);
            last_row = this.getStatRowDom(player, Object.keys(this.stats).map(name => stats[name]), game.winner == player);
            tbody.append(last_row)
        }

        last_row.addClass("hr");
    }

    render = function(data) {
        let tbody = this.dom.find('tbody');
        tbody.empty();
        let last_game = data.pop();
        for(let game of data) this.renderGame(tbody, game);

        if(last_game.is_active_game) this.dom.find("tbody tr:last-child()").addClass("hr-medium");
        this.renderGame(tbody, last_game);
    }

    getStatRowDom = function(player, stats, isLastPlayer) {
        let row_dom = $(this.row_template);
        let player_td = row_dom.find('[name="player"]').text(player);
        if(isLastPlayer) player_td.addClass("bold");

        stats.forEach(stat => row_dom.append($(`<td>${stat}</td>`)))
        return row_dom;
    }
}
