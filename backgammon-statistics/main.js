var gameTable = undefined;
var gameStats = undefined;

init = function() {
	gameTable = new GameTable($('#game_table'));
	gameStats = new GameStatistics($('#stat_table'));
}	

$(document).ready(function(){
	let is_game_ended = 0;
	let directionKeys = {
		"ArrowUp": "up", "ArrowLeft": "left", "ArrowRight": "right", "ArrowDown": "down",
		"KeyW": "up", "KeyS": "down", "KeyA":"left", "KeyD":"right"
	};
	init();

	document.addEventListener("keydown", function(e) {
		if (48 < e.keyCode && e.keyCode < 55) {
			gameTable.addValue(e.keyCode - 48);
			gameStats.renderStatistics(gameTable.getHistory());
		}

		if (96 < e.keyCode && e.keyCode < 103) {
			gameTable.addValue(e.keyCode - 96);
			gameStats.renderStatistics(gameTable.getHistory());
		}
		
		if (e.code == "Enter") {
			init();
		}

		if (e.code == "Backspace") {
			gameTable.removeTurn();
			gameStats.renderStatistics(gameTable.getHistory());
		}

		if (e.code == "KeyI") {
			gameTable.switchEditMode();
		}

		if (e.code in directionKeys) {
			gameTable.moveEditedCell(directionKeys[e.code])
		}


	}, false);
});
