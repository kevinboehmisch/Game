
let isCharacterNotVisible = true; //notwendig, da Character zu Beginn unsichtbar sein soll, schlüpft aus Ei
let isMovingRight = false;
let isMovingLeft = false;
let isJumping =false;
let blockMovementInterval; //Interval für die Blockbewegung
let alertShown = false;
let backgroundPosition = 0;
let backgroundInterval=0;
let characterMovedUp = false;
let characterMovedDown = false;
let originalCharacterTop;
let blocks = [
    	{
        	element: document.getElementById("block"), //HTML-Element des Blocks
        	position: 1250, //Startposition des Blocks
    	},
    	{
        	element: document.getElementById("ei"),
        	position: 656,
    	},
	{
    		element: document.getElementById("schule"),
        	position: 1800,
    	},
	{
		element: document.getElementById("buero"),
        	position: 2600,
    	},
];



//Event Listener für Tastendrücke
document.addEventListener("keydown", function (event) { //keydown bedeutet taste gedrückt

	if (isCharacterNotVisible) {// Überprüfe, ob der Charakter bereits sichtbar ist
		startAnimation();
	}
	
	if (event.key === "ArrowRight" || event.key === "d") {
		event.preventDefault();
        isMovingRight = true; //Charakter bewegt sich nach rechts
		character.classList.remove("flip"); //flip wird removed ursprungsrichtung des Characters wiederhergestellt
        	if (!blockMovementInterval ) { //Starte die Blockbewegung, wenn sie noch nicht gestartet wurde, if-Schleife verhindert, dass mehrere Intervalle gleichzeitig aufgerufen werden
            	blockMovementInterval = setInterval(moveBlocks, 10); 
		walk();
        	}
		if (!backgroundInterval) { //Starte die Hintergrundbewegung, wenn sie noch nicht gestartet wurde
            	backgroundInterval = setInterval(moveBackground, 10);
        	}
    	}
	if (event.key === "ArrowLeft" || event.key === "a") {
		event.preventDefault();
		isMovingLeft = true; //Charakter bewegt sich nach links
		character.classList.add("flip"); //für links Bewegung wird Character horizontal geflipped
        	if (!blockMovementInterval) { //Starte die Blockbewegung, wenn sie noch nicht gestartet wurde
            	blockMovementInterval = setInterval(moveBlocks, 10);
		walk();
        	}
		if (!backgroundInterval) { // Starte die Blockbewegung, wenn sie noch nicht gestartet wurde
            	backgroundInterval = setInterval(moveBackground, 10);
        	}
    	}
	if (event.key === " " || event.key === "w") { //Leertaste wurde gedrückt
    		event.preventDefault(); //verhindern des automatischen scrollen durch drücken der Leertaste
		stopWalking();
		jump(); 
	}
});

//Event Listener für loslassen der Tasten
document.addEventListener("keyup", function (event) { //keyup bedeutet taste nicht mehr gedrückt
	if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "d" || event.key === "a") {
		isMovingRight = false; // Charakter hat aufgehört, sich nach rechts zu bewegen
		isMovingLeft = false;
	clearInterval(blockMovementInterval);// Stoppe die Blockbewegung
		blockMovementInterval = null; // Setze das Interval zurück
	clearInterval(backgroundInterval); // Stoppe die Hintergrundbewegung
		backgroundInterval = null; // Setze das Interval zurück
	stopWalking();
	}
});


//Funktionen zur Bewegung des Characters
function startAnimation(){
	isCharacterNotVisible = false; 
	character.style.opacity = 1; // Ändere die Opazität auf 1, um den Charakter sichtbar zu machen
	ei.style.animation = "none";
	ei.style.backgroundImage = "url('images/eibruch.png')";
}

function jump() {
    if (!isJumping) {
        isJumping = true;
		originalCharacterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
		character.classList.add("animateCharacter");
        //Dynamische Aktualisierung der Animation in CSS, notwendig wenn Charcter zb auf Block steht
        let keyframes = `@keyframes jump {
            0% { top: ${originalCharacterTop}px; }
            1% { background-image: url('images/jump.png'); }
            30% { top: ${originalCharacterTop - 100}px; background-image: url('images/jump.png'); }
            70% { top: ${originalCharacterTop - 100}px; background-image: url('images/jump.png'); }
            99% { background-image: url('images/jump.png');}
            100% { top: ${originalCharacterTop}px; } 
        }`;

		 //Füge die aktualisierten Animationen zu einem neuen <style> -Element hinzu, Keyframes für jump zur Laufzeit einzufügen
		 let styleTag = document.createElement("style"); 
		 styleTag.type = "text/css";
		 styleTag.appendChild(document.createTextNode(keyframes)); //Textknoten erstellt mit den Keyframes als Text, hinzugeügt als childelement
		 document.head.appendChild(styleTag); //style Element auch als Head hinzugefügt, CSS Regeln nun aktiv und wirksam
 

        setTimeout(function () {
            character.classList.remove("animateCharacter");
            isJumping = false; //Setze isJumping zurück, um weitere Sprünge zu ermöglichen
            if (isMovingRight || isMovingLeft) {
                walk();
            }
        }, 545);
    }
}
function walk(){
	if (!isJumping) { 
		if(character.classList !="animateCharacterWalk"){
			character.classList.add("animateCharacterWalk");
		}}	
}
function stopWalking(){
	character.classList.remove("animateCharacterWalk");
}


function moveCharacterUp() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if (!characterMovedUp) { //Überprüfen, ob der Charakter noch nicht verschoben wurde
	character.style.top = 345 + "px";
  	characterMovedUp = true;
	characterMovedDown = false;
    }
}
function moveCharacterDown() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if (!characterMovedDown) { //Überprüfen, ob der Charakter noch nicht verschoben wurde
	character.style.top = 400 + "px";
  	characterMovedDown = true;
	characterMovedUp = false;
    }
}


//Block, welcher Character Schaden hinzufügt
setInterval(function(){
	let characterTop= parseInt(window.getComputedStyle(character).getPropertyValue("top"));
	let blockLeft= parseInt(window.getComputedStyle(block).getPropertyValue("left"));
	if(blockLeft<680 && blockLeft>660 && characterTop>=380 && !alertShown){ //!alertShown, da nur angezeigt werden soll, wenn der altert noch nicht ausgelöst wurde, damit es nur einmal angezeigt wird
		alert("Game over!");
		alertShown= true;
	}		
},10);


//Funktion zur Bewegung der Blöcke/Objekte/Character basierend auf isMovingRight/isMovingLeft
function moveBlocks() {
	if (isMovingRight) {
			//Bewege Blöcke nach rechts
    		blocks.forEach(function (blockData) {
            	let blockElement = blockData.element;
            	let newPosition = blockData.position - 3;
            	blockElement.style.left = newPosition + "px";
            	blockData.position = newPosition;

        });
	}
	if (isMovingLeft) {
        	//Bewege die Blöcke nach links
        	blocks.forEach(function (blockData) {
            	let blockElement = blockData.element;
            	let newPosition = blockData.position + 3;
            	blockElement.style.left = newPosition + "px";
            	blockData.position = newPosition;

        });
    	}
	blocks.forEach(function (blockData) {
		//Bewege den Character nach Oben und Unten wenn er auf Objekten steht
		if (blockData.element.id === "buero") {
        		if ((isMovingRight && blockData.position <= 680) || (isMovingLeft && blockData.position >= 550)) {
					moveCharacterUp(); // Charakter um 20 Pixel nach oben verschieben
        		}
        		if ((isMovingRight && blockData.position <= 550) || (isMovingLeft && blockData.position >= 680)) {
            		moveCharacterDown(); // Charakter um 20 Pixel nach unten verschieben	
    			}
			}
	});
}


//Funktion zum Bewegen des Hintergrundes basierend auf isMovingRight/isMovingLeft
function moveBackground() {
	if (isMovingRight) {
        	//Bewege den Hintergrund nach links
		backgroundPosition -= 3;
    		updateBackgroundPosition();
    	}
	if (isMovingLeft) {
        	//Bewege den Hintergrund nach rechts
		backgroundPosition +=3;
    		updateBackgroundPosition();
    	}
}

//falls mehrere Hintergründe aktualisiert werden müssen extra Funktion für alle wo Hintergründe einfach so hinzugefügt werden können
function updateBackgroundPosition() {
    	ground.style.backgroundPositionX = backgroundPosition + "px"; // Ground-Hintergrundposition aktualisieren
}




