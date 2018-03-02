var app = new Vue({
  el: '#app',
  data: {
    dogs: [],
	cards: [],
	numDogs: 8,
	numReady: 0,
	numCorrect: 0,
	numGuesses: 0,
	best: "-",
    ready: false,
	state: "loading", //Others: "guessing", "waiting", "gameover"
	guess1: null,
	guess2: null,
  },
  created: function() {
    this.getDogs();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getDogs: function() {
      this.ready = false;
	  this.state = "loading";
	  this.dogs = [];
	  for (var i = 0; i < this.numDogs; i++) {
		fetch('https://dog.ceo/api/breeds/image/random').then(response => {
			return response.json();
		}).then(json => {
			this.dogs.push(json.message);
			this.checkReady(i);
			return true;
		}).catch(err => {
			console.log(err);
		});
	  }
    },
	checkReady: function(i) {
		this.numReady += 1;
		if (this.numReady >= this.numDogs){
			this.setUpGame();
			this.ready = true;
		}
	},
	shuffle: function(A){
		var index = A.length;
		while(index > 0) {
			randomIndex = Math.floor(Math.random() * index);
			
			temp = A[randomIndex];
			A[randomIndex] = A[index];
			A[index] = temp;
			
			index--;
		}
		return A;
	},
	setUpGame: function() {
		this.numGuesses = 0;
		this.numCorrect = 0;
		this.guess1 = null;
		this.guess2 = null;
		
		var indices = [...Array(this.numDogs).keys()];
		var doubleIndices = indices.concat(indices);
		var possibles = this.shuffle(doubleIndices);
		this.cards = [];
		for (var i = 0; i < possibles.length; i++) {
			if (possibles[i] == undefined)
				continue;
			this.cards.push({dog: possibles[i], flipped: false, found: false});
		}
		
		this.state = "guessing";
	},
	flipCard: function(card) {
		if(this.state == "guessing") {
			card.flipped = true;
			if (this.guess1 == null)
				this.guess1 = card;
			else{
				this.guess2 = card;
				this.state = "waiting";
				this.guess();
			}
		}
	},
	guess: function() {
		this.numGuesses += 1;
		// Guess is correct
		if(this.guess1.dog == this.guess2.dog){
			this.numCorrect += 1;
			this.guess1.found = true;
			this.guess2.found = true;
			this.state = "guessing";
			if (this.numCorrect === this.numDogs){
				this.state = "gameover";
				alert("Congratulations! You matched them all after " + this.numGuesses + " guesses!");
			}
		}
		// Guess is not correct
		else {
			setTimeout(function(guess1, guess2){
				guess1.flipped = false;
				guess2.flipped = false;
				app.state = "guessing";
			}, 1200, this.guess1, this.guess2);
		}
		this.guess1 = null;
		this.guess2 = null;
	},
	forBalance: function(){
		alert("Note: This button does not do anything. It's presence is merely to balance out the row of buttons. (It'd be kind of odd to just have two buttons there, wouldn't you agree?");
	}
  },
});