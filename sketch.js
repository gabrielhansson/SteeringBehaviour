let organism;
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
	for (meal in meals){
		console.log(meals[meal])
		while(meals[meal].length <= 10){
			meals[meal].push(createVector(random(windowWidth), random(windowHeight)))
		}
	}
	console.log(meals)
}

function draw() {
	background(255);

	organism.eat(meals.snacks)

	//draw the eatable things
	fill(0, 255, 0)
	for (snack of meals.snacks){
		ellipse(snack.x, snack.y, meals.radius, meals.radius)
	}

	fill(255, 0, 0)
	for (bad of meals.poison){
		ellipse(bad.x, bad.y, meals.radius, meals.radius)
	}




}
