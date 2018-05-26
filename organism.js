class Organism {
  constructor(){
    this.position = createVector(random(0, windowWidth), random(0, windowHeight))
    this.velocity = createVector()
    this.headingDiff = Infinity
    this.radius = 10
    this.maxSpeed = 5
    this.maxForce = 0.15
    this.perimiter = 50
    // TODO: max force and maxspeed should alse be decided by the dna
    this.health = 1
    this.maxHealth = this.health

    //TEMP
    this.dna = []
    //index 0 represents food and 1 represents poison
    //that have a weight (attractiveness) towards different meals
    this.dna[0] = random(-1, 1)
    this.dna[1] = random(-1, 1)
  }

  seek(target){
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
    if (meals[target.meal].name === 'food') steer.mult(this.dna[0])
    else steer.mult(this.dna[1])

    //update postition of organism
    this.velocity.add(steer)
    this.position.add(this.velocity)
  }

  //pass in an array things to eat
  hunt(meals){
    //the health of the organism decreases over time
    this.health -= 0.002
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
          if (distance < record) {
            record  = distance
            best = piece
            //the best piece is a vector that has to have
            //a representing index in the pieces array
            best.index = index
            //...but also which meal it is
            best.meal = meals.indexOf(meal)
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

  display(){
    push()
      translate(this.position.x, this.position.y)
      rotate(this.velocity.heading())
      //display weights
      stroke(0, 255, 0)
      line(0, 1, this.dna[0] * 100, 0)
      stroke(255, 0, 0)
      line(0, -1,  this.dna[1] * 100, 0)
      //choose fill color based on health
      let color = map(this.health, 0, this.maxHealth, 255, 0)
      fill(color)
      stroke(0)
      strokeWeight(2)
      triangle(this.radius, 0, -this.radius, this.radius, -this.radius, -this.radius)
    pop()
  }
}
