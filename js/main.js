var combatTable;

$(document).ready(function(){
	combatTable = new CombatTable();
	creatureView = new CreatureView();
	combatCalculator = new CombatCalculator();
	
	$('#combatTable').append(combatTable.getDOM());
});