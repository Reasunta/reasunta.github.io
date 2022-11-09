class GameTable {
	constructor(parent_dom) {
		this.game_history = [];
		this.rows = [];

		this.template = 
		'<h3>Игровая таблица</h3>' +
		'<table class="table table-striped table-hover text-center" id="game_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th><th width="100px">#</th></tr></thead>' +
		'<tbody></tbody></table>';

      	this.row_template = 
		'<tr><td name="turn_id"></td><td name="player_1_turn"></td><td name="player_2_turn"></td><td name="actions"></td></tr>';

      	this.dom = $(this.template);

      	parent_dom.empty();
      	parent_dom.append(this.dom);
	}

	addValue = function(input) {
		this.game_history.push(input);
		this.updateTable();
	}

	updateTable = function() {
		let row_index = Math.trunc((this.game_history.length - 1) / 4);
		if (row_index == this.rows.length) this.addRow();
		else if (row_index == this.rows.length - 2) this.removeRow();
		
		let row = this.rows[row_index];

		let row_dices = this.game_history.slice(row_index * 4, Math.min((row_index + 1)) * 4, this.game_history.length);
		row.find('[name="player_1_turn"]').text((row_dices[0] || "") + " " + (row_dices[1] || ""));
		row.find('[name="player_2_turn"]').text((row_dices[2] || "") + " " + (row_dices[3] || ""));
	}

	addRow = function() {
		let result = $(this.row_template);
		this.dom.find('tbody').append(result);
		this.rows.push(result);
		return result;
	}

	removeRow = function() {
		let row = this.rows.pop();
		row.remove();
	}

	removeTurn = function() {
		this.game_history.pop();
		if(this.game_history.length % 2 == 1) this.game_history.pop();

		this.updateTable();
	}


	getDOM = function() {return this.dom;}

	getHistory = function() {	
		return Object.assign([], this.game_history);
	}
}