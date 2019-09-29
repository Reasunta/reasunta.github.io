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
  }
  
  showCreature = function(instance, event, name) {
	this.name = name;
	this.titleDom.text(name);
	
	let data = COMBATANTS[name] = this.enrichCreature(COMBATANTS[name]);

	this.dom.find("#M").text(data.characteristics.M);
	this.dom.find("#WS").text(data.characteristics.WS);
	this.dom.find("#BS").text(data.characteristics.BS);
	this.dom.find("#S").text(data.characteristics.S);
	this.dom.find("#T").text(data.characteristics.T);
	this.dom.find("#I").text(data.characteristics.I);
	this.dom.find("#Ag").text(data.characteristics.Ag);
	this.dom.find("#Dex").text(data.characteristics.Dex);
	this.dom.find("#Int").text(data.characteristics.Int);
	this.dom.find("#WP").text(data.characteristics.WP);
	this.dom.find("#Fel").text(data.characteristics.Fel);
	
	this.dom.find('#traits').text(data.traits);
	this.dom.find('#optional').text(data.optional_traits);
	
	this.dom.find('#sizes').find('label[title="'+ data.default_size +'"]').find('input').prop('checked', true);
	this.dom.find('#reaches').find('label[title="'+ data.default_reach +'"]').find('input').prop('checked', true);

	this.dom.find('#wounds').val(data.wounds);
	
	this.dom.find('#ablaze').text(data.conditions.ablaze);
	this.dom.find('#blinded').text(data.conditions.blinded);
	this.dom.find('#entangled').text(data.conditions.entangled);
	this.dom.find('#bleeding').text(data.conditions.bleeding);
	this.dom.find('#deafed').text(data.conditions.deafed);
	this.dom.find('#fatigued').text(data.conditions.fatigued);
	this.dom.find('#surprised').text(data.conditions.surprised);
	this.dom.find('#broken').text(data.conditions.broken);
	this.dom.find('#poisoned').text(data.conditions.poisoned);
	this.dom.find('#prone').text(data.conditions.prone);
	this.dom.find('#stunned').text(data.conditions.stunned);
	this.dom.find('#unconscious').text(data.conditions.unconscious);
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