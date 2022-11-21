class GameStatistics {
    constructor(parent_dom) {
        this.stats = [
            "\u2211 <small>бросок</small>", "M<sub>бросок</sub>", "\u039D<sub>дубль</sub>", "N<sub>max дубль</sub>"
        ]

        this.template =
        '<h3>Статистика партий</h3>' +
        '<table class="table table-striped table-hover text-center" id="statistics_table">' +
        '<thead class="head-center"></thead>' +
        '<tbody></tbody></table>';

        this.row_template = '<tr><td name="player" class="col-sm-2"></td></tr>';

        this.dom = $(this.template);

        let head = $('<tr><th>#</th></tr>');
        this.stats.forEach(stat => head.append($(`<th>${stat}</th>`)))
        this.dom.find("thead").append(head);

        parent_dom.empty();
        parent_dom.append(this.dom);
    }

    renderGameStatistics = function(tbody, players, history) {
        if(history.length % 2 == 1) history.pop();
        let p1_stats = [0, 0, 0, 0];
        let p2_stats = [0, 0, 0, 0];

        let totals = [0, 0];
        let doubles = [0, 0];

        for(let i = 0; i < history.length; i += 4) {
            let row = history.slice(i, i + 4);
            p1_stats[0] += this.countPlayerDices(row[0], row[1]);
            p2_stats[0] += this.countPlayerDices(row[2], row[3]);

            p1_stats[2] += this.countPlayerDoubles(row[0], row[1]);
            p2_stats[2] += this.countPlayerDoubles(row[2], row[3]);
        }

        p1_stats[1] = Number(history.length > 0) && (p1_stats[0] / (Math.floor((history.length - 1) / 4) + 1)).toFixed(2);
        p2_stats[1] = Number(history.length > 2) && (p2_stats[0] / (Math.floor((history.length - 1) / 4) + 1 - (history.length % 4) / 2)).toFixed(2);

        tbody.append(
            this.getStatRowDom(players[0], p1_stats, (history.length - 1) % 4 < 2),
            this.getStatRowDom(players[1], p2_stats, (history.length - 1) % 4 > 1).addClass("hr")
        );
    }

    renderStatistics = function(players, history, archive) {
        let tbody = this.dom.find('tbody');
        tbody.empty();

        for(let game of archive) this.renderGameStatistics(tbody, game.players, game.history);

        this.dom.find("tbody tr:last-child()").addClass("hr-medium");
        this.renderGameStatistics(tbody, players, history);

        //this.countFrequencies(frequencies, row);
        /*let turns = [
            (Math.floor((history.length - 1) / 4) + 1),
            (Math.floor((history.length - 1) / 4) + Number((history.length) % 4 == 0))
        ]

        let math_expect = (1 / 6).toFixed(4);
        let deviation = 0.05;

        for(let i = 1; i < 7; i++){
            frequencies[i][0] = ((frequencies[i][0] / 2 / turns[0]) || 0).toFixed(4);
            frequencies[i][1] = ((frequencies[i][1] / 2 / turns[1]) || 0).toFixed(4);

            tbody.append(this.getStatRowDom("Частота " + i, frequencies[i]));
        }*/
    }

    countPlayerDices(dice1, dice2) {
        return (dice1 && (dice1 == dice2 ? 4 * dice1 : dice1 + dice2)) || 0;
    }

    countPlayerDoubles(dice1, dice2) {
        return (dice1 && Number(dice1 > 0 && dice1 == dice2)) || 0;
    }

    countFrequencies(result, row) {
        if(row[0]) { result[row[0]][0]++; result[row[1]][0]++; }
        if(row[3]) { result[row[2]][1]++; result[row[3]][1]++; }
    }

    getStatRowDom = function(player, stats, isLastPlayer) {
        let row_dom = $(this.row_template);
        let player_td = row_dom.find('[name="player"]').text(player);
        if(isLastPlayer) player_td.addClass("bold");

        stats.forEach(stat => row_dom.append($(`<td>${stat}</td>`)))
        return row_dom;
    }

    getDOM = function() {return this.dom;}
}
