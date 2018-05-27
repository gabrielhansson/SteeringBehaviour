let organisms = []
let meals = [
	{
		name: 'food',
		healthyness: 0.5,
		pieces: [],
		radius: 15,
		color: {
			r: 0,
			g: 255,
			b: 0
		},
		regularity: 0.1
	},
	{
		name: 'poison',
		healthyness: -0.5,
		pieces: [],
		radius: 15,
		color: {
			r: 255,
			g: 0,
			b: 0
		},
		regularity: 0.05
	}
]

//TODO: add an addPiece prototype

function setup() {
	createCanvas(windowWidth, windowHeight)

	//TEMP creates 10 new organisms
	for (let i = 0; i < 10; i++){
			organisms[i] = new Organism()
	}

	//TEMP creates 10 new pieces from each meal

	for (let meal of meals){
				while(meal.pieces.length <= 10) {
					meal.pieces.push(createVector(random(windowWidth), random(windowHeight)))
				}
	}
}

function draw() {
	background(255)
	//as it is hard to splice an array whilst it is being iterated,
	//list will keep track of the dead organisms to be deleted after the loop
	let list = []
	for (let organism of organisms)	{
		organism.display()
		organism.stayInBoundary()
		organism.hunt(meals)
		if (organism.health < 0) {
			list.push(organisms.indexOf(organism))
		}
	}

	for (let entry of list){
		organisms.splice(entry, 1)
	}
 	//draw the eatable things
	for (let meal of meals){
		//food should recreated over time based on its regularity
		if (Math.random() <= meal.regularity) meal.pieces.push(createVector(random(windowWidth), random(windowHeight)))

		let r = meal.color.r
		let g = meal.color.g
		let b = meal.color.b
		noStroke()
		fill(r, g, b)
		for (let piece of meal.pieces){
			ellipse(piece.x, piece.y, meal.radius, meal.radius)
		}
	}
}
