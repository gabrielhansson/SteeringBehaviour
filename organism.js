let mutationRate = 0.1
let mutationDiff = 0.1

class Organism {
  constructor(positionX = random(0, width), positionY = random(0, height), dna){
    this.position = createVector(positionX, positionY)
    this.velocity = createVector()
    this.headingDiff = Infinity
    this.radius = 10
    this.maxSpeed = 5
    this.maxForce = 0.15
    this.perimiter = 50
    this.health = 1
    this.maxHealth = this.health
    this.lifeTime = 0
    this.moved

    // TODO: the dna array should be dynamically based on the meals object
    //TEMP: the percpetion radius' lower bound should be based on the meals radius

    //as it shoulde be percieved if it is acutally on it
    //first index represents the meal
    //inside of that array, the first index represents attractiveness
    //and second perceptioin
    if (dna) {
      dna = this.mutate(dna)
    }
    this.dna = dna || [
      [random(-1, 1), random(5, 400)],
      [random(-1, 1), random(5, 400)]
    ]
  }

  live(meals){
    this.moved = false
    //health and lifeTime change over time
    this.health -= env.lostHealth
    this.lifeTime += 1
    this.display()
    this.stayInBoundary()
    this.hunt(meals)
    if (!this.moved) this.updatePos()
  }

  display(){
    push()
      translate(this.position.x, this.position.y)
      rotate(this.velocity.heading())
      if (env.showPheno){
        push()
        //display weights and perception
          noFill()
          strokeWeight(2)
          stroke(0, 255, 0)
          line(0, 0, this.dna[0][0] * 100, 0)
          ellipse(0, 0, this.dna[0][1])
          strokeWeight(1)
          stroke(255, 0, 0)
          line(0, 0,  this.dna[1][0] * 100, 0)
          ellipse(0, 0, this.dna[1][1])
        pop()
      }
      //choose fill color based on health
      let color = map(this.health, 0, this.maxHealth, 255, 0)
      fill(color)
      stroke(255)
      strokeWeight(2)
      triangle(this.radius, 0, -this.radius, this.radius, -this.radius, -this.radius)
    pop()
  }

  stayInBoundary(){
    let desired
    let boundary = 0
    //hits right wall
    if (this.position.x > width - boundary) desired = createVector(-this.maxSpeed, this.velocity.y)
    //hits left wall
    else if (this.position.x < boundary) desired = createVector(this.maxSpeed, this.velocity.y)
    //hits top wall
    else if (this.position.y > height - boundary) desired = createVector(this.velocity.x, -this.maxSpeed)
    //hits bottom wall
    else if (this.position.y < boundary) desired = createVector(this.velocity.x, this.maxSpeed)

    if (desired) {
      desired.setMag(this.maxSpeed)
      let steer = p5.Vector
        .sub(desired, this.velocity)
        .limit(this.maxForce)

      this.velocity
        .add(steer)
        .limit(this.maxSpeed)
      this.updatePos()
    }
  }

  //pass in an array things to eat
  hunt(meals){
    //best piece to eat is the closest one
    let best
    //placeholder for the distance between every object
    let record = Infinity
    for (let meal of meals){
      //the organism can only try to eat if there is actually something to eat
      if (meal.pieces.length > 0) {
        //the organism should only want to eat the closest consumable object
        let index = -1
        for (let piece of meal.pieces){
          index++
          let distance = this.position.dist(piece)
          let currentMeal = meals.indexOf(meal)
          if (distance < record && distance < this.dna[currentMeal][1]) {
            record  = distance
            best = piece
            //the best piece is a vector that has to have
            //a representing index in the pieces array
            best.index = index
            //...but also which meal it is
            best.meal = currentMeal
          }
        }
      }
    }
    //if close enough, it should be eaten
    //the organism's head must almost point at the food
    //the heading should therefore be around less than PI/5 radians
    if (best) {
      if (record < this.radius + meals[best.meal].radius && this.headingDiff < PI/5) {
        meals[best.meal].pieces.splice(best.index, 1)
        this.health += meals[best.meal].healthyness
        if (this.health > this.maxHealth) this.health = this.maxHealth
      }
      //OPTIMIZATION organism does not have to seek if best is already eaten
      else this.seek(best)
    }
  }

  seek(target){
    //creates desired velocity
    let desired = p5.Vector.sub(target, this.position)

    //Implement a slow down effect
    let distance = desired.mag()
    if (distance <= this.perimiter){
      let magnitude = map(distance, 0, this.perimiter, 0, this.maxSpeed)
      desired.setMag(magnitude)
    }
    else desired.setMag(this.maxSpeed)

    this.headingDiff = abs(this.velocity.heading() - desired.heading())

    //steer = desired - current
    let steer = p5.Vector
      .sub(desired, this.velocity)
      .limit(this.maxForce)

    //depending on what type of meal is
    //the organisms dna should decide if it is attracted or not by it
    //TEMP:
    if (meals[target.meal].name === 'food') steer.mult(this.dna[0][0])
    else steer.mult(this.dna[1][0])

    //update postition of organism
    this.velocity
      .add(steer)
      .limit(this.maxSpeed)
    this.updatePos()
  }

  updatePos(){
    this.position.add(this.velocity)
    this.moved = true
  }

  reproduced(){
    return Math.random() < 0.001 ? true : false
  }
  reproduce(){
    return new Organism(this.position.x, this.position.y, this.dna)
  }

  // TODO: the mutation should not exeed current weight and percpetion ranges
  mutate(dna){
    return dna.map(base => {
      return base.map(e => {
        if (Math.random() < mutationRate){
         const change = e * mutationDiff
         return e += random(-change, change)
        }
        else return e
      })
    })
  }
}
