const CREATURE_DATA = {
	"The peoples of the Reikland": {
		"Human": {
			"characteristics": {
				"M": 4, "WS": 30, "BS": 30, "S": 30, "T":30, "I": 30,
				"Ag": 30, "Dex": 30, "Int": 30, "WP": 30, "Fel": 30
			},
			"traits": ["Prejudice (choose one)", "Weapon+7"],
			"optional_traits": ["Disease","Ranged+8 (50)", "Spellcaster"],
			"default_size": "Average",
			"default_reach": "Average",
			"wounds": 12
		}
	}
}

const MODIFIERS = {
	"S_crowd": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 60, "valueType": "percent",
		"summary": "Shooting into a crowd",
		"description": "Shooting into a crowd (13+ targets)"
	},
	"S_pbr": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 40, "valueType": "percent", 
		"summary": "Shooting at PB Range",
		"description": "Shooting a target at Point Blank Range: less than Range ÷ 10"
	},"S_lg": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 40, "valueType": "percent",
		"summary": "Shooting at a large group",
		"description": "Shooting at a Large group (7–12 targets)"
	},
	"S_sr": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 20, "valueType": "percent",
		"summary": "Shooting at Short Range",
		"description": "Shooting at Short Range: less than half weapon range"
	},
	"S_sg": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 20, "valueType": "percent", 
		"summary": "Shooting at a small group",
		"description": "Shooting at a small group (3–6 targets)"
	},
	"S_aim": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": 20, "valueType": "percent", 
		"summary": "Shooting with aiming",
		"description": "Shooting when you spent your last Action aiming (no Test to aim required)"
	},
	"S_lr": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -10, "valueType": "percent",
		"summary": "Shooting at Long Range",
		"description": "Shooting at Long Range: up to double weapon range"
	},
	"S_mv": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -10, "valueType": "percent",
		"summary": "Shooting with Move",
		"description": "Shooting on a Round where you also use your Move"
	},
	"S_sl": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -20, "valueType": "percent", 
		"summary": "Shooting to the location",
		"description": "A called shot to a specific Hit Location. If you succeed you hit that location"
	},
	"S_hw": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -20, "valueType": "percent", 
		"summary": "Fog, mist, shadow",
		"description": "Shooting targets concealed by fog, mist or shadow"
	},
	"S_er": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -30, "valueType": "percent", 
		"summary": "Shooting at Extreme Range",
		"description": "Shooting at Extreme range, up to three times weapon range"
	},
	"S_drk": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"shot"},
		"value": -30, "valueType": "percent", 
		"summary": "Shooting in darkness",
		"description": "Shooting in darkness"
	},
	"A_3t1": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"attack"},
		"value": 40, "valueType": "percent", 
		"summary": "Attacking 3 to 1",
		"description": "Attacking an opponent you outnumber 3 to 1"
	},
	"A_eng": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"attack"},
		"value": 20, "valueType": "percent",
		"summary": "Attacking an Engaged",
		"description": "Attacking an Engaged opponent in the sides or rear"
	},
	"A_2t1": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"attack"},
		"value": 20, "valueType": "percent",
		"summary": "Attacking 2 to 1", 
		"description": "Attacking an opponent you outnumber 2 to 1"
	},
	"A_ew": {
		"target":"self",
		"conditions":{"type":"checkbox", "value":"attack"},
		"value": -20, "valueType": "percent", 
		"summary": "Extreme weather",
		"description": "Attacking in a monsoon, hurricane, thick blizzard, or other extreme weather"
	},
	"Es": {
		"target":"self",
	    "conditions":
		{"type": "all", "value": [
			{"type":"checkbox", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"defend"}
			]},
			{"type":"reach", "sign":">", "value":"Average"}
		]}, 
		"value": -20, "valueType": "percent",
		"summary": "Enclosed space",
		"description": "Fighting in an enclosed space with a weapon with a Length longer than Medium"
	},
	"Drk": {
		"target":"self",
		"conditions":
		{"type": "all", "value": [
			{"type":"checkbox", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"defend"}
			]}
		]},
		"value": -20, "valueType": "percent", 
		"summary": "Darkness",
		"description": "Close combat in darkness"
	},
	"Offh": {
		"target":"self",
		"conditions": {"type":"checkbox", "value":"any"},	
		"value": -20, "valueType": "percent", 
		"summary": "Weapon in off hand",
		"description": "Using a weapon in your off hand"
	},
	"Dt": {
		"target":"self",
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"dodge"}
			]}
		]},
		"value": -10, "valueType": "percent", 
		"summary": "Difficult terrain",
		"description": "Attacking whilst in the mud, heavy rain or difficult terrain"
	},
	"At": {
		"target":"self",
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"dodge"}
			]}
		]},
		"value": -30, "valueType": "percent", 
		"summary": "Arduous terrain",
		"description": "Attacking or dodging in the deep snow, water or other arduous terrain"
	},
	"Sc": {
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "subject": "opponent", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"shot"}
			]}
		]},
		"target":"self", "value": -10, "valueType": "percent", 
		"summary": "Soft cover",
		"description": "Target in soft cover (behind a hedge for example)"
	},
	"Mc": {
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "subject": "opponent", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"shot"}
			]}
		]},
		"target":"self", "value": -20, "valueType": "percent", 
		"summary": "Medium cover",
		"description": "Target in medium cover (wooden fence for example)"
	},
	"Hc": {
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "subject": "opponent", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"attack"},
				{"type":"action", "value":"shot"}
			]}
		]},
		"target":"self", "value": -30, "valueType": "percent", 
		"summary": "Hard cover",
		"description": "Target in hard cover (behind stone wall, for example)"
	},
	"Ds": {
		"conditions":{"type": "all", "value": [
			{"type":"checkbox", "value":"any"},
			{"type":"any", "value":[
				{"type":"action", "value":"defend"},
				{"type":"action", "value":"dodge"}
			]}
		]},
		"target":"self", "value": 20, "valueType": "percent", 
		"summary": "In the defensive",
		"description": "As your action, choose a skill to use defensively and you will get +20 to defensive tests using the skill until the start of your next turn"
	}
}

const REACHES = ['Personal', 'Very Short', 'Short', 'Average', 'Long', 'Very Long', 'Massive'];
const SIZES = ['Tiny', 'Little', 'Small', 'Average', 'Large', 'Enormous', 'Monstrous'];

var COMBATANTS = {}

