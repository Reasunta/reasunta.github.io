class CombatTableRow {
  constructor(index, name, initiative, wounds) {
    this.template = 
	  '<tr><td name="index"></td><td name="name"></td><td name="I"></td><td name="W"></td>' +
	  '<td><span class="fa fa-minus-square-o tracker-left"></span><span name="ADV"></span>' + 
	  '<span class="fa fa-plus-square-o tracker-right"></span></td>' + 
	  '<td>' + 
	  '<button name="remove" class="btn align-right tracker-right"><span class="fa fa-minus-circle"></span></button>' + 
	  '<div name="combatButton" class="align-right"></div></td></tr>';
	
	this.defendTemplate = '<button name="defend" class="btn"><span class="fa fa-shield"></span></button>';
	this.nextTurnTemplate = '<button name="nextTurn" class="btn"><span class="fa fa-arrow-circle-o-right"></span></button>';
	
	this.dom = $(this.template);
	
	this.setIndex(index);
	this.setName(name);
	this.setInitiative(initiative);
	this.setWounds(wounds);
	this.setAdvances(0);
	
	this.dom.on('click', 'button[name="remove"]', this.sendMessage.bind(this, this, "removeRow"));
	this.dom.on('click', 'button[name="nextTurn"]', this.sendMessage.bind(this, this, "selectNextPlayer"));
  }
  
  sendMessage = function(instance, message, event) {
	$(document).trigger(message, this.getName());
  }
  
  setCurrentPlayer = function() {
	this.dom.find('div[name="combatButton"]').empty();
	this.dom.find('div[name="combatButton"]').append($(this.nextTurnTemplate));
	this.dom.css("background-color", "yellow")
  }
  
  setOtherPlayer = function() {
	this.dom.find('div[name="combatButton"]').empty();
	this.dom.find('div[name="combatButton"]').append($(this.defendTemplate));
	this.dom.removeAttr('style');
  }
  
  getIndex = function() {return this.index;} 
  setIndex = function(value) {
	this.index = value; 
	this.dom.find('[name="index"]').text(value);
	if(value == 1) this.setCurrentPlayer();
	else this.setOtherPlayer();
  }
  getName = function() {return this.name;} 
  setName = function(value) {this.name = value; this.dom.find('[name="name"]').text(value);}
  getInitiative = function() {return this.I;}
  setInitiative = function(value) {this.I = value; this.dom.find('[name="I"]').text(value);}
  getWounds = function() {return this.W;}
  setWounds = function(value) {this.W = value; this.dom.find('[name="W"]').text(value);}
  getAdvances = function() {return this.ADV;}
  setAdvances = function(value) {this.ADV = value; this.dom.find('[name="ADV"]').text(value);}
  
  getDOM = function() {return this.dom;}
}