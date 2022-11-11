class GameTable {
	constructor(parent_dom) {
		this.history = [];

		this.edit_coords = [0,0];
		this.is_edit_mode = false;

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
		this.history.push(input);
		this.renderTable();
	}

	removeTurn = function() {
		this.history.pop();
		if(this.history.length % 2 == 1) this.history.pop();
		this.renderTable();
	}

	scrollToRow = function(row_index) {
		let scroll_position = Math.max(
			this.dom.find("tbody tr").height() * row_index + this.dom.find("th").offset().top - this.dom.last().height(), 0);
		this.dom.animate({
        	scrollTop: scroll_position
    	}, 50);
	}

	renderTable = function() {
		let tbody = this.dom.find('tbody');
		tbody.empty();

		for(let i = 0; i < this.history.length; i += 4) {	
			let row = $(this.row_template);
			let row_index = this.getRowIndex(i);

			row.find('[name="turn_id"] small').text(row_index + 1);
			row.find('[name="player_1_turn"]').text((this.history[i] || "") + " " + (this.history[i + 1] || ""));
			row.find('[name="player_2_turn"]').text((this.history[i + 2] || "") + " " + (this.history[i + 3] || ""));
			
			if (this.isEditing() && this.edit_coords[0] == row_index) 
				row.find("td:nth-child("+ this.edit_coords[1]+")").addClass("info");

			tbody.append(row);
		}

		let row_to_scroll =  this.isEditing() ? this.edit_coords[0] : this.getRowIndex();
		this.scrollToRow(row_to_scroll);	
	}

	getHistory = function() {	
		return Object.assign([], this.history);
	}

	switchEditMode = function() {
		this.is_edit_mode = !this.is_edit_mode;
		
		if (this.is_edit_mode) {
			this.edit_coords[0] = this.getRowIndex();
			this.edit_coords[1] = (this.history.length - 1) % 4 < 2 ? 2 : 3
		}

		this.renderTable();
	}

	isEditing = function() { return this.is_edit_mode; }

	getRowIndex = function(history_index) { 
		let index = history_index == undefined ? this.history.length - 1 : history_index;
		return Math.floor(index / 4); 
	}

	moveEditedCell = function(way) {
		if (!this.isEditing()) return;

		if (way == "up") this.edit_coords[0] = Math.max(this.edit_coords[0] - 1, 0);
		if (way == "down") this.edit_coords[0] = Math.min(this.edit_coords[0] + 1, this.getRowIndex());
		if (way == "left") this.edit_coords[1] = 2;
		if (way == "right") this.edit_coords[1] = 3;
		
		this.renderTable();
	}
}