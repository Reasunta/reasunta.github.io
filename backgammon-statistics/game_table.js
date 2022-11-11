class GameTable {
	constructor(parent_dom) {
		this.history = [];

		this.edited_values = [];
		this.edit_index = 0;
		this.is_edit_mode = false;


		this.template = 
		'<h3>Игровая таблица</h3>' +
		'<div class="game-table-scroll"><table class="table table-striped table-hover text-center" id="game_table">' +
		'<thead class="head-center">' +
		'<tr><th>#</th><th>Игрок 1</th><th>Игрок 2</th></tr></thead>' +
		'<tbody></tbody></table></div>';

      	this.row_template = 
		'<tr><td name="turn_id"><small class="text-muted"></small></td><td name="player_1_turn"></td><td name="player_2_turn"></td></tr>';

      	this.dom = $(this.template);

      	parent_dom.empty();
      	parent_dom.append(this.dom);
	}

	insertValue = function(input) {
		if(!this.isEditing()) this.history.push(input);
		else {
			this.edited_values.push(input);
			if(this.edited_values.length == 2) 
				this.history.splice(this.edit_index, 0, this.edited_values.pop(), this.edited_values.pop());
		}
	}

	removeTurn = function() {
		if(!this.isEditing()) {
			this.history.pop();
			if(this.history.length % 2 == 1) this.history.pop();
		}
		else {
			this.history.splice(this.edit_index, 2);
			if (this.history.length == 0) this.switchEditMode();
			else if (this.edit_index >= this.history.length) this.moveEditedCell("left");
		}
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

			row.find('[name="turn_id"] small').text(this.getRowIndex(i) + 1);
			row.find('[name="player_1_turn"]').text((this.history[i] || "") + " " + (this.history[i + 1] || ""));
			row.find('[name="player_2_turn"]').text((this.history[i + 2] || "") + " " + (this.history[i + 3] || ""));
			
			if (this.isEditing() && (this.edit_index == i || this.edit_index == i + 2)) {
				let column = 2 + (this.edit_index - i) / 2;
				row.find("td:nth-child(" + column + ")").addClass("info");
			}
			
			tbody.append(row);
		}

		let row_to_scroll =  this.isEditing() ? this.getRowIndex(this.edit_index) : this.getRowIndex();
		this.scrollToRow(row_to_scroll);	
	}

	getHistory = function() {	
		return Object.assign([], this.history);
	}

	switchEditMode = function() {
		this.is_edit_mode = !this.is_edit_mode;
		if (this.is_edit_mode) this.edit_index = this.getLastIndex();
	}

	isEditing = function() { return this.is_edit_mode; }

	getLastIndex = function() {return (this.history.length - 1) - (this.history.length - 1) % 2}
	getRowIndex = function(history_index) { 
		let index = history_index == undefined ? this.getLastIndex() : history_index;
		return Math.floor(index / 4); 
	}

	moveEditedCell = function(way) {
		if (!this.isEditing()) return;

		if (way == "up") this.edit_index = Math.max(this.edit_index - 4, 0);
		if (way == "down") this.edit_index = Math.min(this.edit_index + 4, this.getLastIndex());
		if (way == "left") this.edit_index = Math.max(this.edit_index - 2, 0);;
		if (way == "right") this.edit_index = Math.min(this.edit_index + 2, this.getLastIndex());
	}
}