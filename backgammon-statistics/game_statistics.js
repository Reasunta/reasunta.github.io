class GameStatistics {
    constructor(parent_dom) {
        this.stats = {
            turns: "N<sub>turn",
            total: "\u2211<small>roll</small>",
            mean: "M<sub>roll</sub>",
            doubles: "N<sub>dbl</sub>",
            max_doubles: "N<sub>max dbl</sub>"
        }

        this.template =
        `<h3>Статистика партий</h3>
         <div class="stat-table-scroll"><table class="table table-striped table-hover text-center" id="statistics_table">
         <thead class="head-center"></thead>
         <tbody></tbody></table></div>`;

        this.row_template = '<tr><td name="session_id"></td><td name="player" class="col-sm-2"></td></tr>';

        this.dom = $(this.template);

        let head = $('<tr><th class="col-sm-1">№</th><th>#</th></tr>');
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

    renderGame = function(tbody, game_id, game) {
        let rows = [];

        for(let player in game.game) {
            let stats = this.countPlayerStats(game.game[player]);
            let el = this.getStatRowDom(game_id, player,
                Object.keys(this.stats).map(name => stats[name]),
                game.winner == player,
                game.is_active_game
            );

            rows.push(el);
            tbody.append(el);
        }

        rows.pop().addClass("hr").find('[name="session_id"]').remove();
        rows.pop().find('[name="session_id"]').attr("rowspan", "2").addClass("warning").css("vertical-align", "middle");
    }

    render = function(data) {
        let tbody = this.dom.find('tbody');
        tbody.empty();
        for(let i in data) this.renderGame(tbody, Number(i) + 1, data[i]);

        this.dom.find("tbody tr.last:not(.hr):not(:first-child())").addClass("hr-medium");

        this.scrollToRow(data.length * 2);
    }

    getStatRowDom = function(game_id, player, stats, is_last_player, is_active_game) {
        let row_dom = $(this.row_template);
        if(is_active_game) row_dom.addClass("last");

        let player_td = row_dom.find('[name="player"]').text(player);
        if(is_last_player) player_td.addClass("bold");
        row_dom.find('[name="session_id"]').text(game_id);

        stats.forEach(stat => row_dom.append($(`<td>${stat}</td>`)))
        return row_dom;
    }

    scrollToRow = function(row_index) {
        let scroll_position = Math.max(
            this.dom.find("tbody tr").height() * row_index + this.dom.find("th").offset().top - this.dom.last().height(), 0);
        this.dom.animate({
            scrollTop: scroll_position
        }, 50);
    }
}
