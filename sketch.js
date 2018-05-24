let organism
let meals = {
	snacks: [],
	poison: [],
	radius: 15
}



function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke()

	organism = new Organism()

	//TEMP
	for (let meal in meals){
		while(meals[meal].length <= 10){
			meals[meal].push(createVector(random(windowWidth), random(windowHeight)))
		}
	}
}

function draw() {
	background(255);

	organism.eat(meals)
 	//draw the eatable things
	fill(0, 255, 0)
	for (let snack of meals.snacks){
		ellipse(snack.x, snack.y, meals.radius, meals.radius)
	}

	fill(255, 0, 0)
	for (let bad of meals.poison){
		ellipse(bad.x, bad.y, meals.radius, meals.radius)
	}
}
