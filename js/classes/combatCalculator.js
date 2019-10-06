class CombatCalculator {
	constructor() {
	this.dom = $("#combatCalculator");
	this.attackerDom = this.dom.find('[name="attacker"]');
	this.defenderDom = this.dom.find('[name="defender"]');
	
	this.attackerName = null;
	this.defenderName = null;
	this.attacker = null;
	this.defender = null;
	
	this.modifierTemplate = '<tr><td><span name="modName"></span></td><td name="modValue"></td></tr>';
		
	$(document).on('currentProfileChanged', '', this.setAttacker.bind(this, this));
	$(document).on('defendProfile', '', this.setDefender.bind(this, this));
	$(document).on('profileChanged', '', this.updateModifiers.bind(this, this));
	this.dom.on('change','[name="attaction"]:checked',this.updateAction.bind(this, this));
	this.dom.on('change','[name="defaction"]:checked',this.updateAction.bind(this, this));
	/*this.dom.on('change','#wounds',this.changeWounds.bind(this, this));
	this.dom.on('click', '#conditions .fa-plus-square-o', this.addCondition.bind(this, this));
	this.dom.on('click', '#conditions .fa-minus-square-o', this.removeCondition.bind(this, this));
	this.dom.on('change','#modifiers input[type="checkbox"]',this.updateModifier.bind(this, this));*/
	
  }
  
  setAttacker = function(instance, event, name) {
	instance.attacker = COMBATANTS[name];
	instance.attackerName = name;
	instance.attackerDom.find('h4').text(name);
	
	instance.clearDefender();
	
	instance.applyModifiers('attacker');
  }
  setDefender = function(instance, event, name) {
	instance.defender = COMBATANTS[name];
	instance.defenderName = name;
	instance.defenderDom.find('h4').text(name);
	
	instance.applyModifiers('attacker');
	instance.applyModifiers('defender');
  }
  
  clearDefender = function() {
	this.defender = null;
	this.defenderName = null;
	this.defenderDom.find('h4').text('');
	this.defenderDom.find('table tbody').empty();
  }
  
  updateAction = function(instance, event) {
	  instance.applyModifiers('attacker');
	  instance.applyModifiers('defender');
  }
  
  updateModifiers = function(instance, event, name) {
	if(name != instance.getAttackerName() && name != instance.getDefenderName()) return;
	instance.applyModifiers('attacker');
	instance.applyModifiers('defender');
  }
  
  applyModifiers = function(role) {
	let dom = this.getSelfDom(role);
	dom.find('table tbody').empty();
	
	for(let key in MODIFIERS) {
		let mod = MODIFIERS[key];
		if (!this.checkCondition(role, key, mod.conditions)) continue;
		
		let modRow = $(this.modifierTemplate);
		modRow.find('[name="modName"]').text(mod.summary);
		modRow.find('[name="modName"]').attr('title', mod.description);
		
		let modSign = mod.value >=0 ? '+' : '-';
		let modUnit = (mod.valueType == 'percent') ? '' : ' SL';
		modRow.find('[name="modValue"]').text(modSign + Math.abs(mod.value) + modUnit);
		
		dom.find('table tbody').append(modRow);
	}
  }
  
  checkCondition = function(role, key, condition) {
	switch(condition.type) {
	  case 'checkbox': return this.checkCheckbox(role, key, condition);
	  case 'action': return this.checkAction(role, condition);
	  case 'reach': return this.checkReach(role, condition);
	  case 'all': return condition.value.every(innerCondition => this.checkCondition(role, key, innerCondition));
	  case 'any': return condition.value.some(innerCondition => this.checkCondition(role, key, innerCondition));
	  default: return false;
	}
  }
  
  checkCheckbox = function(role, key, cond) {
	let subject = cond.hasOwnProperty('subject') ? cond.subject : 'self';
	let currentRole = (subject == 'self') ? role : this.getOpponentRole(role);
	
	let creature = this.getSelf(currentRole);
	let dom = this.getSelfDom(currentRole);
	let result = creature && creature.hasOwnProperty('modifiers') && creature.modifiers[key];
	let actionResult = cond.value != 'any'
	  ? dom.find('div[name="actions"] input:checked').val() == cond.value
	  : true;
	return result && actionResult;
  }
  
  checkAction = function(role, cond) {
	return this.getSelfDom(role).find('div[name="actions"] input:checked').val() == cond.value;
  }
  
  checkReach = function(role, cond) {
	let subject = cond.hasOwnProperty('subject') ? cond.subject : 'self';
	let currentRole = (subject == 'self') ? role : this.getOpponentRole(role);
	
	let value = REACHES.indexOf(this.getSelf(currentRole).default_reach);
	
	let target = (cond.value == 'opponent')
	  ? REACHES.indexOf(this.getSelf(this.getOpponentRole(currentRole)).default_reach)
	  : REACHES.indexOf(cond.value);
	
	switch (cond.sign) {
		case '<': return value < target;
		case '=': return value == target;
		case '>': return value > target;
		default: return false;
	}
	
	
  }
  
  
  getDOM = function() {return this.dom;}
  getAttackerName = function() {return this.attackerName;}
  getDefenderName = function() {return this.defenderName;}
  setAttackerName = function(value) {this.attackerName = value;}
  setDefenderName = function(value) {this.defenderName = value;}
  
  getOpponentRole = function(role) {return (role == 'attacker') ? 'defender' : 'attacker';} 
  getSelf = function(role) {return (role == 'attacker') ? this.attacker : this.defender;}
  getSelfDom = function(role) {return (role == 'attacker') ? this.attackerDom : this.defenderDom;}
}