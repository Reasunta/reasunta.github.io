class CombatTable {
	constructor() {
    this.template = 
	'<h3>Combat Table</h3>' +
	'<table class="table table-striped table-hover text-center">' +
	'<thead><th>#</th><th>Name</th><th>I</th><th>W</th><th>Adv</th>' +
	'<th width="100px">'+
	'<div class="btn-group"><button data-toggle="dropdown" class="btn align-right dropdown-toggle"><span class="fa fa-plus-circle "></span></button>' +
	'<ul name="creatureList" class="dropdown-menu"></ul></div>'+
	'</th></thead><tbody></tbody></table>';
	
	this.groupTemplate = 
		'<li class="dropdown-submenu">' +
		'<a tabindex="-1" href="#" name="groupName"></a>' +
		'<ul class="dropdown-menu" name="creatures"></ul></li>';
	
	this.listItemTemplate = '<li><a href="#" name="add"></a></li>';
	
	this.dom = $(this.template);
	this.initDropdownList();
	
	this.rows = {};
	
	this.dom.on("click", 'a[name="add"]', this.addCreature.bind(this, this));
	$(document).on('removeProfile', '', this.removeCreature.bind(this, this));
	$(document).on('nextProfile', '', this.selectNextPlayer.bind(this, this));
  }
  
  initDropdownList = function(){
	for(let group in CREATURE_DATA) {
		let groupDom = $(this.groupTemplate);
		groupDom.find('a').text(group);
		
		for(let name in CREATURE_DATA[group]) {
			let creature = CREATURE_DATA[group][name];
			
			let listItemDom = $(this.listItemTemplate);
			listItemDom.find('a').text(name);
			
			groupDom.find('ul[name="creatures"]').append(listItemDom);
		}
		
		this.dom.find('ul[name="creatureList"]').append(groupDom);
	};
  }
  
  addCreature = function(instance, event) {
	let senderDom = $(event.target);
	let group = senderDom.parents().find('a[name="groupName"]').text();
	let name = senderDom.text();
	 
	let creature = CREATURE_DATA[group][name];
	
	let uniqueName = this.generateUniqieName(name);
	  
	let index = this.dom.find('tbody tr').length + 1;
	let row = new CombatTableRow(index, uniqueName, creature.characteristics.I, creature.wounds);
	this.rows[uniqueName] = row;
	this.dom.find('tbody').append(row.getDOM());
	
	creature["advances"] = 0;
	COMBATANTS[uniqueName] = creature;
  }
  
  removeCreature = function(instance, event, name) {
	this.rows[name].getDOM().remove();
	delete this.rows[name];
	this.recountRowIndices();
	
	delete COMBATANTS[name];
  }
  
  selectNextPlayer = function(instance, event, name) {
	let lastRow = this.dom.find('tr:last');
	lastRow.after(this.rows[name].getDOM());
	this.recountRowIndices();
  }
  
  generateUniqieName = function(name) {
	for (let i = 1; i < 1000; i++){
		let result = name + " " + i;
		if(!(result in this.rows)) return result;
	}
	return "Too many same units!!! " + name;
  }
  
  recountRowIndices = function() {
	  for(name in this.rows) {
		  let index = this.rows[name].getDOM().index() + 1;
		  this.rows[name].setIndex(index);
	  }
  }
  
  getDOM = function() {return this.dom;}
}