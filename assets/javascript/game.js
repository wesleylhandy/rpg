var gameOn = false;
var chooseDefender = false;
var userDeath = false;
var computerDeath = false;
var victim;
var assailant;
var winner;
var deadJedi = [];

var LukeSkywalker = {
	hp: 100,
	attackPower: 6
}
var ObiwanKenobi = {
	hp: 120,
	attackPower: 8
}
var DarthMaul = {
	hp: 180,
	attackPower: 10
}
var AnakinSkywalker = {
	hp: 150,
	attackPower: 12
}


$(".character").on("click", function() {
	if (!(gameOn) && !(chooseDefender)) {
		chooseDefender = true;
		$(this).css("border-color", "#320B68");
		$("#choose").html("Enemy");
		assailant = $(this).detach();
		assailant.appendTo("#active");
		console.log(assailant);
		$("#battle").fadeIn("slow");
	} else if (chooseDefender) {
		chooseDefender = false;
		gameOn = true;
		$("#alerts").html("");
		$(this).css("border-color", "#B9161A");
		victim = $(this).detach();
		victim.appendTo("#under-attack");
		console.log(victim);
		$("#available").fadeOut("slow");
		$("#fight").fadeIn("slow");
	} 
})

function reset() {
	if (userDeath) {
		winner = victim.detach();
	}
	gameOn = false;
	chooseDefender = false;
	userDeath = false;
	computerDeath = false;
	for (let x = 0; x < deadJedi.length; x++) {
		deadJedi[x].appendTo("#available");
	}
	deadJedi = [];
	winner.appendTo("#available");
	$("#alerts").html("");
	$("#choose").html("Character");
	$(".character").css("border-color", "green");
	$("#reset").fadeOut("slow");
	$("#battle").fadeOut("slow");
	$("#LukeSkywalker").data("hp", LukeSkywalker.hp).find(".jedi-HP").html(LukeSkywalker.hp);
	$("#LukeSkywalker").data("attack-power", LukeSkywalker.attackPower);
	$("#ObiwanKenobi").data("hp", ObiwanKenobi.hp).find(".jedi-HP").html(ObiwanKenobi.hp);;
	$("#ObiwanKenobi").data("attack-power", ObiwanKenobi.attackPower);
	$("#DarthMaul").data("hp", DarthMaul.hp).find(".jedi-HP").html(DarthMaul.hp);;
	$("#DarthMaul").data("attack-power", DarthMaul.attackPower);
	$("#AnakinSkywalker").data("hp", AnakinSkywalker.hp).find(".jedi-HP").html(AnakinSkywalker.hp);;
	$("#AnakinSkywalker").data("attack-power", AnakinSkywalker.attackPower);
	$("#available").fadeIn("slow");
}

function checkForWin () {
	if (deadJedi.length === 3) {
		$("#alerts").append("YOU WIN!!!");
		$("#fight").fadeOut("fast");
		$("#battle").fadeOut("fast");
		$("#reset").fadeIn("slow");
		gameOn = false;
		winner = assailant.detach();
	} else {
		$("#fight").fadeOut("slow");
		$("#available").fadeIn("slow");
		chooseDefender = true;
	}
}

function battle() {
	var vhp = parseInt(victim.data("hp"));
	var attack = parseInt(assailant.data("attack-power"));
	vhp-= attack;
	$("#alerts").html("You did " + attack + " damage to " + victim.data("name") +". ");
	attack+=attack;
	victim.data("hp", vhp);
	$("#under-attack").find(".jedi-HP").html(vhp);
	assailant.data("attack-power", attack);
	if (vhp <= 0) {
		deadJedi.push(victim.detach());
		console.log(deadJedi);
		$("#alerts").append(" And you killed him!");
		checkForWin();
	} else {
	
		var uhp = parseInt(assailant.data("hp"));
		var counterAttack = parseInt(victim.data("counter-attack"));
		uhp -= counterAttack;
		assailant.data("hp", uhp);
		$("#active").find(".jedi-HP").html(uhp);
		$("#alerts").append(victim.data("name") + " did " + counterAttack + " damage to you.");
		if (uhp <= 0) {
			userDeath = true;
			deadJedi.push(assailant.detach());
			console.log(deadJedi);
			$("#alerts").append(" And he killed you!");
			$("#fight").fadeOut("fast");
			$("#battle").fadeOut("fast");
			$("#reset").fadeIn("slow");
		}
	}
}


$("button").on("click", function() {
	if (userDeath || !(gameOn)) {
		reset();
	} else {
		battle();
	}
})
