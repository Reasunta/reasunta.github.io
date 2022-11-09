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
		let p1_total = 0;
		let p2_total = 0;

		if(history.length % 2 == 1) history.pop();

		for(let i = 0; i < history.length; i += 4) {	
			p1_total += this.countPlayerDices(history[i] || 0, history[i + 1] || 0);
			p2_total += this.countPlayerDices(history[i + 2] || 0, history[i + 3] || 0);
		}
		
		this.dom.find('tbody').append(this.getStatRowDom("Total", p1_total, p2_total));
	}

	countPlayerDices(dice1, dice2) {
		return dice1 == dice2 ? 4 * dice1 : dice1 + dice2;
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