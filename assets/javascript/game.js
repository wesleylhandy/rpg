//initialize global variables
var gameOn = false;
var chooseDefender = false;
var userDeath = false;
var computerDeath = false;
var victim;
var assailant;
var winner;
var deadJedi = [];
// Jedi objects
var LukeSkywalker = {
	hp: 100,
	attackPower: 6
}
var ObiwanKenobi = {
	hp: 120,
	attackPower: 6
}
var DarthMaul = {
	hp: 180,
	attackPower: 6
}
var AnakinSkywalker = {
	hp: 150,
	attackPower: 6
}

//manages click events on Jedi
//will only work during original Jedi selection
//or after user kills an opponent
$(".character").on("click", function() {
	//check for startgame conditions
	if (!(gameOn) && !(chooseDefender)) {
		chooseDefender = true; // flags that user needs to choose opponent next
		$(this).css("border-color", "#320B68");
		$("#choose").html("Enemy"); //changes choose Jedi prompt
		assailant = $(this).detach(); // removes user from available
		assailant.appendTo("#active"); // adds user to battle
		console.log(assailant);
		$("#battle").fadeIn("slow");
	} else if (chooseDefender) { //user is alive and needs a new opponent
		chooseDefender = false;
		gameOn = true; //flags functionality of fight and reset buttons, disables characters
		$("#alerts").html(""); // clears any alerts, if any
		$(this).css("border-color", "#B9161A");
		victim = $(this).detach(); // removes opponent from available
		victim.appendTo("#under-attack"); // adds opponent to battle
		console.log(victim);
		$("#available").fadeOut("slow"); //hide available
		$("#fight").fadeIn("slow"); //show fight button
	} 
})

function reset() {
	// gets opponent to reinsert into available if the user lost
	if (userDeath) {
		winner = victim.detach();
	}
	gameOn = false;
	chooseDefender = false;
	userDeath = false;
	computerDeath = false;
	// reattaches all deadJedi (if any), including a dead user, back to available
	for (let x = 0; x < deadJedi.length; x++) {
		deadJedi[x].appendTo("#available");
	}
	//emptys deadJedi array (perhaps there is function I could chain to above to do the same?)
	deadJedi = [];
	winner.appendTo("#available"); //winner will either be user or opponent, attaches to available
	//reset display to start screen
	$("#alerts").html("");
	$("#choose").html("Character");
	$(".character").css("border-color", "#7D9403");
	$("#reset").fadeOut("slow");
	$("#battle").fadeOut("slow");
	//resets data on all Jedi to start conditions
	$("#LukeSkywalker").data("hp", LukeSkywalker.hp).find(".jedi-HP").html(LukeSkywalker.hp);
	$("#LukeSkywalker").data("attack-power", LukeSkywalker.attackPower);
	$("#ObiwanKenobi").data("hp", ObiwanKenobi.hp).find(".jedi-HP").html(ObiwanKenobi.hp);;
	$("#ObiwanKenobi").data("attack-power", ObiwanKenobi.attackPower);
	$("#DarthMaul").data("hp", DarthMaul.hp).find(".jedi-HP").html(DarthMaul.hp);;
	$("#DarthMaul").data("attack-power", DarthMaul.attackPower);
	$("#AnakinSkywalker").data("hp", AnakinSkywalker.hp).find(".jedi-HP").html(AnakinSkywalker.hp);;
	$("#AnakinSkywalker").data("attack-power", AnakinSkywalker.attackPower);
	//only shows Jedi once they have been reset to original conditions
	$("#available").fadeIn("slow");
}

function checkForWin () {
	//see if all three jedi other than user have been killed (i.e. added to deadJedi array)
	if (deadJedi.length === 3) {
		$("#alerts").append(" YOU WIN!!!");
		$("#fight").fadeOut("fast"); //hide fight button
		$("#battle").fadeOut("fast"); //hide battle area
		$("#reset").fadeIn("slow"); //show start over button
		gameOn = false;
		//get winner out of attack position to be reinserted into available on reset
		winner = assailant.detach();
	} else { 
		$("#fight").fadeOut("slow"); // hide fight button
		$("#available").fadeIn("slow"); //show remaining available Jedi
		chooseDefender = true;
	}
}

//calculates damage done by user before taking damage from opponent
function battle() {
	var vhp = parseInt(victim.data("hp")); // get victim hit points
	var attack = parseInt(assailant.data("attack-power")); // get user attack power 
	vhp-= attack; //decrease victim hit points
	victim.data("hp", vhp); //change data on victim hp
	$("#under-attack").find(".jedi-HP").html(vhp); // display change in hp
	$("#alerts").html("You did " + attack + " damage to " + victim.data("name") +". ");
	attack+=attack; //update attack-power
	assailant.data("attack-power", attack); //change data on user attack power
	//check to see if victim has been killed
	if (vhp <= 0) { 
		deadJedi.push(victim.detach());
		console.log(deadJedi);
		$("#alerts").append(" And you killed him!");
		//checks to see if all jedi are dead
		checkForWin();
	} else {
		//this only runs if victim still alive. This calculates counter-damage
		var uhp = parseInt(assailant.data("hp")); // get user hit points
		var counterAttack = parseInt(victim.data("counter-attack")); // get victim counter
		uhp -= counterAttack; //decrease user hit points
		assailant.data("hp", uhp); //change data on user hp
		$("#active").find(".jedi-HP").html(uhp); //display user hp
		$("#alerts").append(victim.data("name") + " did " + counterAttack + " damage to you.");
		//check to see if user has been killed
		if (uhp <= 0) {
			userDeath = true;
			//store dead Jedi in an array
			deadJedi.push(assailant.detach());
			console.log(deadJedi);
			//go to end-game screen
			$("#alerts").append(" And he killed you!");
			$("#fight").fadeOut("fast"); // hide fight button
			$("#battle").fadeOut("fast"); //hide battle area
			$("#reset").fadeIn("slow"); // show start over button
		}
	}
}

// Attack and Start Over Buttons only active after players selected
// Start Over Button only visible after game won or game lost
$("button").on("click", function() {
	if (userDeath || !(gameOn)) {
		reset();
	} else {
		battle();
	}
})
