// list that holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// array for opened cards
var openedCards = [];

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

// declaring moves variable
let moves = 0;

// congrats popup variable
let popup = document.getElementById("congrats-popup");

// refresh value in HTML
let refreshHTML = function(target, value) {
	return target.innerHTML = value;
};

// counter and CounterSet
let CounterSet = function(moves) {
	this.target = document.querySelector(".moves");
	refreshHTML(this.target, moves);
};

CounterSet.prototype.add = function() {
	moves++;
	refreshHTML(this.target, moves);
};

CounterSet.prototype.restart = function() {
	moves = 0;
	refreshHTML(this.target, moves);
};

let counter = new CounterSet(moves);

// stars and StarRating
let StarRating = function() {
	this.stars = document.querySelectorAll(".fa-star");
};

StarRating.prototype.rate = function() {
	if(moves > 12 && moves < 18) {
		this.stars[2].classList.remove("shine");
	} else if(moves > 18) {
		this.stars[1].classList.remove("shine");
	}
};

StarRating.prototype.restart = function() {
	for(var i=0; i<this.stars.length; i++) {
		this.stars[i].classList.add("shine");
	}
};

let stars = new StarRating();

// shuffle cards and display each card in the deck when page is loaded
window.onload = startGame();

// loop to add event listeners to each card
for(var i = 0; i < cards.length; i++) {
	cards[i].addEventListener("click", displayCard);
	cards[i].addEventListener("click", cardOpen);
	cards[i].addEventListener("click", congratulations);
}

// restart button
document.querySelector(".restart").addEventListener("click", startGame);
document.querySelector(".close-popup").addEventListener("click", closePopup);

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// start a new game
function startGame() {
	cards = shuffle(cards);
	for(var i=0; i<cards.length; i++) {
		document.querySelector(".deck").innerHTML = "";
		[].forEach.call(cards, function(item) {
			document.querySelector(".deck").appendChild(item);
		});
		cards[i].classList.remove("show", "open", "match", "disabled");
	}

	counter.restart();
	stars.restart();
}

// toggles open, show and disabled classes
function displayCard() {
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}

// add opened cards to openedCards list and check if cards are match or not
function cardOpen() {
	openedCards.push(this);
	if(openedCards.length === 2) {
		counter.add();
		stars.rate();
		if(openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}

// when cards match
function matched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("match", "disabled");
		openedCards[i].classList.remove("show", "open", "no-event");
	}
	openedCards = [];
}

// when cards don't match
function unmatched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("unmatched");
	}
	disable();
	setTimeout(function() {
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
		}
		enable();
		openedCards = [];
	}, 1100);
}

// disable cards
function disable() {
	for(var i = 0; i < cards.length; i++) {
		cards[i].classList.add("disabled");
	}
}

// enable all but matched cards
function enable() {
	for(var i = 0; i < cards.length; i++) {
		if(!cards[i].classList.contains("match")) {
			cards[i].classList.remove("disabled");
		};
	}
}

// congratulations popup when all cards match
function congratulations() {
	if(matchedCard.length == 2) {
		popup.classList.add("show");
		document.getElementById("total-moves").innerHTML = moves;
		document.getElementById("star-rating").innerHTML = document.querySelector(".stars").innerHTML;
		closePopup();
	};
}

function closePopup() {
	document.getElementById("close-popup").addEventListener("click", function() {
		popup.classList.remove("show");
		startGame();
	});
}