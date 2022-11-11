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
		let tbody = this.dom.find('tbody');
		tbody.empty();

		if(history.length % 2 == 1) history.pop();

		let totals = [0, 0];
		let doubles = [0, 0];
		let frequencies = {1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0], 6: [0, 0]}

		for(let i = 0; i < history.length; i += 4) {	
			let row = history.slice(i, i + 4);
			this.countDices(totals, row);
			this.countDoubles(doubles, row);
			this.countFrequencies(frequencies, row);
		}
		
		tbody.append(this.getStatRowDom("Всего очков", totals));
		tbody.append(this.getStatRowDom("Дублей", doubles));
		
		let turns = [
			(Math.floor((history.length - 1) / 4) + 1), 
			(Math.floor((history.length - 1) / 4) + Number((history.length) % 4 == 0))
		]

		let math_expect = (1 / 6).toFixed(4);
		let deviation = 0.05;

		for(let i = 1; i < 7; i++){
			frequencies[i][0] = ((frequencies[i][0] / 2 / turns[0]) || 0).toFixed(4);
			frequencies[i][1] = ((frequencies[i][1] / 2 / turns[1]) || 0).toFixed(4);

			tbody.append(this.getStatRowDom("Частота " + i, frequencies[i]));
		}
	}

	countDices(result, row) {
		if(row[0]) result[0] += row[0] == row[1] ? 4 * row[0] : row[0] + row[1];
		if(row[3]) result[1] += row[2] == row[3] ? 4 * row[2] : row[2] + row[3];
	}

	countDoubles(result, row) {
		if(row[0]) result[0] += Number(row[0] > 0 && row[0] == row[1]);
		if(row[3]) result[1] += Number(row[2] > 0 && row[2] == row[3]);
	}

	countFrequencies(result, row) {
		if(row[0]) { result[row[0]][0]++; result[row[1]][0]++; } 
		if(row[3]) { result[row[2]][1]++; result[row[3]][1]++; }
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