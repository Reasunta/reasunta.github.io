class GameStatistics {
	constructor(parent_dom) {
		this.template = 
		'<h3>Статистика</h3>' +
		'<table class="table table-striped table-hover text-center" id="statistics_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th></tr></thead>' +
		'<tbody></tbody></table>';

      	this.row_template = 
		'<tr><td name="stat_name"></td><td name="player_1"></td><td name="player_2"></td></tr>';

      	this.dom = $(this.template);

      	parent_dom.empty();
      	parent_dom.append(this.dom);
	}


	renderStatistics = function(history) {
		this.dom.find("tbody").empty();

		this.countTotal(history);
	}

	countTotal = function(history) {
		let totals = [0, 0];
		let doubles = [0, 0]

		if(history.length % 2 == 1) history.pop();
		if(history.length % 4 == 2) {
			history.push(0); 
			history.push(0);
		}

		for(let i = 0; i < history.length; i += 4) {	
			totals[0] += this.countPlayerDices(history[i], history[i + 1]);
			totals[1] += this.countPlayerDices(history[i + 2], history[i + 3]);

			doubles[0] += history[i] > 0 && history[i] == history[i + 1] ? 1 : 0;
			doubles[1] += history[i + 2] > 0 && history[i + 2] == history[i + 3] ? 1 : 0;
		}
		
		let tbody = this.dom.find('tbody');
		tbody.append(this.getStatRowDom("Всего очков", totals));
		tbody.append(this.getStatRowDom("Дублей", doubles));
	}


	countPlayerDices(dice1, dice2) {
		return dice1 == dice2 ? 4 * dice1 : dice1 + dice2;
	}

	getStatRowDom = function(stat_name, player_states) {
		let row_dom = $(this.row_template);
		row_dom.find('[name="stat_name"]').text(stat_name);
		row_dom.find('[name="player_1"]').text(player_states[0]);
		row_dom.find('[name="player_2"]').text(player_states[1]);
		return row_dom;
	}

	getDOM = function() {return this.dom;}
}