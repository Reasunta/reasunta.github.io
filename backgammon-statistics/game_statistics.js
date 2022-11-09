class GameStatistics {
	constructor() {
		this.template = 
		'<h3>Статистика</h3>' +
		'<table class="table table-striped table-hover text-center" id="statistics_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th></tr></thead>' +
		'<tbody></tbody></table>';

      	this.row_template = 
		'<tr><td name="stat_name"></td><td name="player_1"></td><td name="player_2"></td></tr>';

      	this.dom = $(this.template);
	}

	countTotal = function(history) {
		let player_1_total = 0;
		let player_2_total = 0;

		history.forEach(function(row) {
			player_1_total += row[0] == row[1] ? 4 * row[0] : row[0] + row[1];
			player_2_total += row[2] == row[3] ? 4 * row[2] : row[2] + row[3];
		});

		this.dom.find('tbody').append(this.getStatRowDom("Total", player_1_total, player_2_total));
	}

	getStatRowDom = function(stat_name, player_1_state, player_2_state) {
		let row_dom = $(this.row_template);
		row_dom.find('[name="stat_name"]').text(stat_name);
		row_dom.find('[name="player_1"]').text(player_1_state);
		row_dom.find('[name="player_2"]').text(player_2_state);
		return row_dom;
	}

	getDOM = function() {return this.dom;}
}