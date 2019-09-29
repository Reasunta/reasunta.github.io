var combatTable;

$(document).ready(function(){
	combatTable = new CombatTable();
	$('#combatTable').append(combatTable.getDOM());
});