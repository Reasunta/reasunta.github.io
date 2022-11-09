var gameTable = undefined;
var gameStats = undefined;

init = function() {
	gameTable = new GameTable($('#game_table'));
	gameStats = new GameStatistics($('#stat_table'));
}	

$(document).ready(function(){
	let is_game_ended = 0;

	init();

	document.addEventListener("keydown", function(e) {
		if (48 < e.keyCode && e.keyCode < 55) {
			gameTable.addValue(e.keyCode - 48);
			gameStats.renderStatistics(gameTable.getHistory());
		}
		
		if (e.code == "Enter") {
			init();
		}

		if(e.code == "KeyE") {
			gameTable.removeTurn();
			gameStats.renderStatistics(gameTable.getHistory());
		}


	}, false);
});
