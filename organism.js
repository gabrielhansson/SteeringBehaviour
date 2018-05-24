class Organism {
  constructor(){
    this.position = createVector()
    this.velocity = createVector()
    this.headingDiff = Infinity
    this.radius = 10
    this.maxSpeed = 5
    this.maxForce = 0.15
    this.perimiter = 50
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

    //update postition of organism
    this.velocity.add(steer)
    this.position.add(this.velocity)

    //display organism
    fill(0)
    push()
      translate(this.position.x, this.position.y)
      rotate(this.velocity.heading())
      triangle(this.radius, 0, -this.radius, this.radius, -this.radius, -this.radius)
    pop()
  }

  //pass in an array things to eat
  eat(meals){
    //best piece to eat is the closest one
    let best
    //placeholder for the distance between every object
    let record = Infinity
    for (let meal in meals){
      //the organism can only try to eat if there is actually something to eat
      if (Array.isArray(meals[meal]) && meals[meal].length > 0) {
        //the organism should only want to eat the closest consumable object
        let index = -1
        for (let piece of meals[meal]){
          index++
          let distance = this.position.dist(piece)
          if (distance < record) {
            record  = distance
            best = piece
            //the best piece is a vector that has to have a representing index in the array
            best.index = index
            //...but also which meal it is
            best.meal = meal
          }
        }
      }
    }
    //if close enough, it should be eaten
    //the organism's head must almost point at the food
    //the heading should therefore be less than 30 degress = PI/6 radians
    if(record < this.radius + meals.radius) {
      meals[best.meal].splice(best.index, 1)
    }
    //OPTIMIZATION organism does not have to seek if best is already eaten
    else this.seek(best)
  }
}
