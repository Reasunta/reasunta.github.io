class GameTable {
	constructor() {
		this.current_turn_dices = [];
		this.game_history = [];
		this.current_row = undefined;
		this.template = 
		'<h3>Игровая таблица</h3>' +
		'<table class="table table-striped table-hover text-center" id="game_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th><th width="100px">#</th></tr></thead>' +
		'<tbody></tbody></table>';

      	this.row_template = 
		'<tr><td name="turn_id"></td><td name="player_1_turn"></td><td name="player_2_turn"></td><td name="actions"></td></tr>';

      	this.dom = $(this.template);
	}

	updateHistory = function(input) {
		if (this.current_turn_dices.length == 4) {
			this.game_history.push(this.current_turn_dices);
			this.current_turn_dices = [];
			this.current_row = undefined;
		};

		this.current_turn_dices.push(input);

		this.updateRow();
	}

	updateRow = function() {
		if (this.current_row) this.current_row.remove();
		if(this.current_turn_dices.length > 0) {
			this.current_row = this.getHistoryRowDom(this.current_turn_dices);
			this.dom.find('tbody').append(this.current_row);
		}
		else {
			this.current_row = this.dom.find('tbody tr:last-child()');
			this.current_turn_dices = this.game_history.pop() || [];
		}
	}

	removeTurn = function() {
		this.current_turn_dices = this.current_turn_dices.slice(0, 2 * Math.trunc((this.current_turn_dices.length-1) / 2));
		this.updateRow();
	}

	getHistoryRowDom = function(current_turn_dices) {
		let row_dom = $(this.row_template);
		row_dom.find('[name="player_1_turn"]').text((current_turn_dices[0] || "") + " " + (current_turn_dices[1] || ""));
		row_dom.find('[name="player_2_turn"]').text((current_turn_dices[2] || "") + " " + (current_turn_dices[3] || ""));
		return row_dom;
	}

	getDOM = function() {return this.dom;}

	finishGame = function() {
		this.current_turn_dices = this.current_turn_dices.slice(0, 2 * Math.trunc((this.current_turn_dices.length) / 2));
		this.game_history.push(this.current_turn_dices);
			
		return this.game_history;
	}
}