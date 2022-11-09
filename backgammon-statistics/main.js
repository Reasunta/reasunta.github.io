var gameTable = undefined;
var gameStats = undefined;

init = function() {
	$('#game_table').empty();
	$('#stat_table').empty();

	gameTable = new GameTable();
	gameStats = new GameStatistics();


	$('#game_table').append(gameTable.getDOM());
	$('#stat_table').append(gameStats.getDOM());
}	

$(document).ready(function(){
	let is_game_ended = 0;

	init();

	document.addEventListener("keydown", function(e) {
		if (48 < e.keyCode && e.keyCode < 55)
			gameTable.updateHistory(e.keyCode - 48);
		if (e.code == "Enter") {
			is_game_ended = 1 - is_game_ended;

			is_game_ended 
				? gameStats.countTotal(gameTable.getHistory())
				: init();

		}
		if(e.code == "KeyE") {
			gameTable.removeTurn();
		}
	}, false);
});
  