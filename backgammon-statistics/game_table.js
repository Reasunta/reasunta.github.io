class GameTable {
	constructor(parent_dom) {
		this.game_history = [];
		this.rows = [];

		this.edited_cell_coords = undefined;
		this.edited_cell = undefined;

		this.template = 
		'<h3>Игровая таблица</h3>' +
		'<div class="game-table-scroll"><table class="table table-striped table-hover text-center" id="game_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th><th width="100px">#</th></tr></thead>' +
		'<tbody></tbody></table></div>';

      	this.row_template = 
		'<tr><td name="turn_id"><small class="text-muted"></small></td><td name="player_1_turn"></td><td name="player_2_turn"></td><td name="actions"></td></tr>';

      	this.dom = $(this.template);

      	parent_dom.empty();
      	parent_dom.append(this.dom);
	}

	addValue = function(input) {
		this.game_history.push(input);
		this.updateTable();
	}

	scrollToRow = function(row_index) {
		let scroll_position = Math.max(this.rows[0].height() * row_index + this.dom.find("th").offset().top - this.dom.last().height(), 0);
		this.dom.animate({
        	scrollTop: scroll_position
    	}, 50);
	}

	updateTable = function() {
		let row_index = Math.trunc((this.game_history.length - 1) / 4);
		if (row_index == this.rows.length) this.addRow();
		else if (row_index == this.rows.length - 2) this.removeRow();
		
		this.scrollToRow(row_index);

		let row = this.rows[row_index];
		let row_dices = this.game_history.slice(row_index * 4, Math.min((row_index + 1)) * 4, this.game_history.length);
		row.find('[name="player_1_turn"]').text((row_dices[0] || "") + " " + (row_dices[1] || ""));
		row.find('[name="player_2_turn"]').text((row_dices[2] || "") + " " + (row_dices[3] || ""));
	}

	addRow = function() {
		let result = $(this.row_template);
		result.find('[name="turn_id"] small').text(this.rows.length + 1);

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

	getHistory = function() {	
		return Object.assign([], this.game_history);
	}

	switchEditMode = function() {
		if (this.edited_cell) {
			this.edited_cell.removeClass("info");
			this.edited_cell = undefined;
			this.edited_cell_coords = undefined;
		}
		else { 
			this.edited_cell_coords = [this.rows.length - 1, (this.game_history.length - 1) % 4 < 2 ? 2 : 3];
			this.setEditedCell();
			this.edited_cell.click();
		}
	}

	setEditedCell = function() {
		if(this.edited_cell) this.edited_cell.removeClass("info");
		this.edited_cell = this.rows[this.edited_cell_coords[0]].find("td:nth-child("+ this.edited_cell_coords[1]+")");
		this.edited_cell.addClass("info");
		this.scrollToRow(this.edited_cell_coords[0]);
	}

	isEditing = function() {
			return this.edited_cell != undefined;
	}

	moveEditedCell = function(way) {
		if (!this.isEditing()) return;

		if (way == "up") this.edited_cell_coords[0] = Math.max(this.edited_cell_coords[0] - 1, 0);
		if (way == "down") this.edited_cell_coords[0] = Math.min(this.edited_cell_coords[0] + 1, this.rows.length - 1);
		if (way == "left") this.edited_cell_coords[1] = 2;
		if (way == "right") this.edited_cell_coords[1] = 3;
		this.setEditedCell();
	}

}