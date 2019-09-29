var combatTable;

$(document).ready(function(){
	combatTable = new CombatTable();
	creatureView = new CreatureView();
	
	$('#combatTable').append(combatTable.getDOM());
});