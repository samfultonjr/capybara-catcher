let numStars = 800;
let stars = [];


let warp = 0.02;

let playing = false;

let roundStartTime = 0;

const gameContainerEl = document.querySelector('.game-container');














function setup() {

//  fcapture = new FCapture(); //uncomment to capture frames
//  fcapture.startCapture(); //uncomment to capture frames

background('255');

  createCanvas(windowWidth, windowHeight - 100);

  angleMode(DEGREES);

  for(let i=0;i<numStars;i++){
    stars[i] = new Star();
  }

}










class Orb {
    x = 300;
    y = 300;

    active = false;
    activationDate = 0;

    totalLife = 5000;
    startSize = 20;
    size = 0.6;

    activate () {
        this.active = true;
        this.activationDate = Date.now();

    }


    update () {
        // let lifeElapsed = (Date.now() - this.activationDate) > this.totalLife ? this.totalLife : (Date.now() - this.activationDate);
        // let percentLifeElapsed = lifeElapsed / this.totalLife;
        // this.size = this.startSize - (percentLifeElapsed * this.startSize);
        // this.size = this.size < 0 ? 0 : this.size;
        // if(this.size === 0) this.active = false;

        // this.x = this.startX + this.scalar * cos(this.angle);
        // this.y = this.startY + this.scalar * sin(this.angle);
        this.angle++;
    }

}










let orbStates = [
    new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb()
];









var angle = 0;	// initialize angle variable
var scalar = 50;  // set the radius of circle
var startX = 100;	// set the x-coordinate for the circle center
var startY = 100;	// set the y-coordinate for the circle center



function draw() {
//  fcapture.frameCapture(); //uncomment to capture frames


  // CONSTANTS
  background(0);
  textFont('Comfortaa');
  fill('#b898f3');

  textSize(25);
  textAlign(LEFT,TOP);
  text("WARP "+round(warp*10)/10.0,40,40);


  // CONSTANTS


  if(!playing) {    
    textSize(40);
    textAlign(CENTER,CENTER);
    strokeWeight(800);
    text("PRESS TO LAUNCH", width/2, height/2);

  } else {
      // playing game
      let timeElapsed = Date.now() - roundStartTime;
    if(timeElapsed < 1000) {
        textSize(40);
        textAlign(CENTER,CENTER);
        strokeWeight(800);
        text("3", width/2, height/2);
    } else if(timeElapsed < 2000) {
        textSize(40);
        textAlign(CENTER,CENTER);
        strokeWeight(800);
        text("2", width/2, height/2);
    } else if(timeElapsed < 3000) {
        textSize(40);
        textAlign(CENTER,CENTER);
        strokeWeight(800);
        text("1", width/2, height/2);
    } else {

        // COUNTDOWN IS OVER, REAL PLAY
        let i = 0;
        for (const orbState of orbStates) {
            if(!orbState.active) {
                orbState.activate();
            }
            orbState.update();
         
            if(orbState.size !== 0) {
                stroke('#b898f3');
                angleMode(DEGREES);
    
                // orbStates[0].x = orbState.startX + orbState.scalar * cos(orbState.angle);
                // orbStates[0].y = orbState.startY + orbState.scalar * sin(orbState.angle);
  
                // ellipse(orbState.x, orbState.y, orbState.size, orbState.size);

                var x = startX + scalar * cos(angle);
                var y = startY + scalar * sin(angle);
                
                fill('#b898f3');
                
                ellipse(x, y, 30);
                
                angle++;	// increment angle for the next frame

                stroke('#000');
                // An ellipse at 150, 150 with radius 280
                // ellipse(150, 150, 280, 180) 
            }
           i++;
        }


    }


    
  }



  // STAR RUNNER
//   translate(width/2,height/2);
//   for(var star of stars){
//     star.update();
//     star.display();
//     }
  // STAR RUNNER

//  fcapture.getCanvas(); //uncomment to capture frames
}



const startGame = () => {
    if(playing) return;
    playing = true;
    roundStartTime = Date.now();
}




function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 100);
}






gameContainerEl.addEventListener('click', () => {
    startGame();
});









function Star(){
  this.dist = random(width+height);
  this.angle = random(0,2*PI);
  this.speed = random(0*warp,0.3*warp);
  this.bright = 0;
  this.weight = random(1,2);
  
  this.display = function() {
    push();
    rotate(this.angle);
    translate(this.dist,0);
    stroke(this.colormap(this.bright));
    strokeWeight(this.weight);
    line(0,0,this.speed,0);
    pop();
    this.bright+=5;
  }

  this.update = function() {
    this.speed += 0.3*warp;
    this.dist += this.speed;
    
    
    if(this.dist>width+height){
      this.angle = random(2*PI);
      this.dist = random(width/50,width);
      this.speed = random(0*warp,0.3*warp);
      this.bright = 0
      this.weight = random(1,2)
    }

  }
  
  this.colormap = function(b){
    colorMode(HSB);
    sat = map(warp,1,7,0,100);
    return color(200,sat,b);
  
  }
}















function FCapture(){

  var fps = 60;
  var capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  var startMillis;

  	this.startCapture = function(){
      frameRate(fps);
	  capturer.start();
    }

    this.frameCapture = function(){

      if (startMillis == null) {
        startMillis = millis();
      }
      var duration = 32000;

      var elapsed = millis() - startMillis;
      var t = map(elapsed, 0, duration, 0, 1);

      if (t > 1) {
      noLoop();
      console.log('finished recording.');
      capturer.stop();
      capturer.save();
      return;
    }

  }

  this.getCanvas = function(){
    console.log('capturing frame');
    capturer.capture(document.getElementById('defaultCanvas0'));
  }

}




document.querySelector('body').addEventListener('click', () => {
    warp += 0.05;
})