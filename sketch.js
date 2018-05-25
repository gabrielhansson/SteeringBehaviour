let organisms = []
let meals = [
	{
		name: 'food',
		healthyness: 100,
		pieces: [],
		radius: 15,
		color: {
			r: 0,
			g: 255,
			b: 0
		}
	},
	{
		name: 'food',
		healthyness: -50,
		pieces: [],
		radius: 15,
		color: {
			r: 255,
			g: 0,
			b: 0
		}
	}
]



function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke()

	//TEMP creates 10 new organisms
	for (let i = 0; i < 10; i++){
			organisms[i] = new Organism()
	}

	//TEMP creates 10 new pieces from each meal
	for (let meal of meals){
		console.log(meal)
		while(meal.pieces.length <= 10){
			meal.pieces.push(createVector(random(windowWidth), random(windowHeight)))
		}
	}
}

function draw() {
	background(255);
	for (let organism of organisms)	organism.eat(meals)
 	//draw the eatable things
	for (let meal in meals){
		let r = meals[meal].color.r
		let g = meals[meal].color.g
		let b = meals[meal].color.b
		fill(r, g, b)
		for (let piece of meals[meal].pieces){
			ellipse(piece.x, piece.y, meals[meal].radius, meals[meal].radius)
		}
	}
}
