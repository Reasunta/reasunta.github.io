class CreatureView {
	constructor() {
	this.dom = $("#creatureView");
	this.titleDom = $('h3[aria-controls="creatureView"]');
	
	$(document).on('showProfile', '', this.showCreature.bind(this, this));
	this.dom.on('change','[name="sizeradio"]',this.changeSize.bind(this, this));
	this.dom.on('change','[name="wrradio"]',this.changeReach.bind(this, this));
	this.dom.on('change','#wounds',this.changeWounds.bind(this, this));
	this.dom.on('click', '#conditions .fa-plus-square-o', this.addCondition.bind(this, this));
	this.dom.on('click', '#conditions .fa-minus-square-o', this.removeCondition.bind(this, this));
	this.dom.on('change','#modifiers input[type="checkbox"]',this.updateModifier.bind(this, this));
	
  }
  
  updateModifier = function(instance, event) {
	  COMBATANTS[instance.getName()].modifiers[event.target.value] = event.target.checked;
	  $(document).trigger('profileChanged', instance.getName());
  }
  
  addCondition = function(instance, event) {
	let condition = $(event.target).parent().find('span').get(1).id;
	let newValue = ++COMBATANTS[instance.getName()].conditions[condition];
	instance.dom.find('#'+condition).text(newValue);
	$(document).trigger('profileChanged', instance.getName());
  }
  
  removeCondition = function(instance, event) {
	let condition = $(event.target).parent().find('span').get(1).id;
	if (COMBATANTS[instance.getName()].conditions[condition] == 0) return;
	
	let newValue = --COMBATANTS[instance.getName()].conditions[condition];
	instance.dom.find('#'+condition).text(newValue);
	$(document).trigger('profileChanged', instance.getName());
  }

  changeSize = function(instance, event) {
	COMBATANTS[instance.getName()].default_size = event.target.value;
	$(document).trigger('profileChanged', instance.getName());
  }
  changeReach = function(instance, event) {
	COMBATANTS[instance.getName()].default_reach = event.target.value;
	$(document).trigger('profileChanged', instance.getName());
  }
  changeWounds = function(instance, event) {
	COMBATANTS[instance.getName()].wounds = event.target.value;
	$(document).trigger('profileChanged', instance.getName());
  }
  
  showCreature = function(instance, event, name) {
	this.name = name;
	this.titleDom.text(name);
	
	let data = COMBATANTS[name] = this.enrichCreature(COMBATANTS[name]);

	for(let ch in data.characteristics) this.dom.find("#"+ch).text(data.characteristics[ch]);
	for(let cnd in data.conditions) this.dom.find('#'+cnd).text(data.conditions[cnd]);
	
	this.dom.find('#traits').text(data.traits);
	this.dom.find('#optional').text(data.optional_traits);
	
	this.dom.find('#sizes').find('label[title="'+ data.default_size +'"]').find('input').prop('checked', true);
	this.dom.find('#reaches').find('label[title="'+ data.default_reach +'"]').find('input').prop('checked', true);

	this.dom.find('#wounds').val(data.wounds);
	
	this.dom.find('#modifiers input[type="checkbox"]').prop('checked', false);
	for(let modVal in data.modifiers) this.dom.find('#modifiers input[value="'+ modVal +'"]').prop('checked', data.modifiers[modVal]);
  }
  
  enrichCreature = function(creature) {
	if(typeof creature.conditions == "undefined") 
	  creature['conditions'] = {
		'ablaze':0, 'blinded': 0, 'entangled': 0, 'bleeding':0, 
		'deafed':0, 'fatigued': 0, 'surprised':0, 'broken':0,
		'poisoned':0, 'prone':0, 'stunned':0, 'unconscious':0
	};
	
	if(typeof creature.modifiers == "undefined") creature.modifiers = {};
	
	return creature;
  }
  
  getDOM = function() {return this.dom;}
  getName = function() {return this.name;}
}