let organisms = []
//current generation
let cG = []
const meals = [
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
		regularity: 0.05
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

//optimization variables
const optVar = {
	popSize: 10,
	fitnessPow: 4,
	lostHealth: 0.005
}

//TODO: add an addPiece prototype


function setup() {
	createCanvas(windowWidth, windowHeight)

	//TEMP: creates 10 new organisms
	for (let i = 0; i < optVar.popSize; i++){
		organisms[i] = new Organism()
	}
	cG = organisms.slice()

	//TEMP: creates new pieces from each meal
	for (let meal of meals){
		while(meal.pieces.length <= 20) {
			meal.pieces.push(createVector(random(windowWidth), random(windowHeight)))
		}
	}
}

function draw() {
	background(50)
	//as it is hard to modify an array whilst it is being iterated,
	//list will keep track of the dead organisms to be deleted after the loop
	//creations will keep track of newly created organisms
	let list = []
	let creations = []
	for (let organism of organisms)	{
		organism.live(meals)
		//the longer an organism lives,
		//the greater chance it has to reproduce
		if (organism.reproduced()){
			let newOrganism = organism.reproduce()
			creations.push(newOrganism)
			cG.push(newOrganism)
		}
		if (organism.health < 0) {
			list.push(organisms.indexOf(organism))
		}
	}

	for (let element of list){
		organisms.splice(element, 1)
	}

	for (let element of creations){
		organisms.push(element)
	}

	//if all the organisms have died, one must create a new population
	if (organisms.length <= 0) {
		//to preserve variation but increase the performance,
		//higher fitness will increase the chance for a organism
		//to be included in the next generation
		let newGeneration = []
		let totalLifeTime = cG.reduce((sum, organism) => sum += organism.lifeTime, 0)
		//this is an array with a percentage of the life time
		fittnessOfCG = cG.map(organism => organism.lifeTime / totalLifeTime)
		//creates a new population
		let index = 0
		for (let i = 0; i < optVar.popSize; i++){
			let random = Math.random()
			while (random - fittnessOfCG[index] > 0){
				index++
				random = Math.random()
				if (index >= cG.length){
					index = 0
				}
			}
			newGeneration.push(new Organism(undefined, undefined, cG[index].dna))
		}
		organisms = newGeneration.slice()
		cG = newGeneration.slice()
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
