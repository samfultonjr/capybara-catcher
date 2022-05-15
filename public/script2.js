let numStars = 800;
let stars = [];

let warp = 0.01;

let playing = false;

let roundStartTime = 0;

let storage = window.localStorage;

const gameContainerEl = document.querySelector('.game-container');

const warpEl = document.querySelector('.game-warp');
const launchButtonEl = document.querySelector('.game-launch-button');
const warpHighscoreEl = document.querySelector('.game-warp-highscore');


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



class Orb {
    x = 300;
    y = 300;

    active = false;
    activationDate = 0;

    totalLife = 2000;
    
    adjustedLife = 0;

    startSize = 75;
    size = 0;

    rounds = 0;

    activate () {
        this.active = true;
        this.activationDate = Date.now();
        this.size = this.startSize;
        this.x = Math.random() * width;
        this.y = (Math.random() * (height - 100));
        // rounds++;
        warp = JSON.parse((warp + 0.01).toFixed(2));
        this.adjustedLife = this.adjustedLife * 0.98;
    }


    update () {



        let lifeElapsed = (Date.now() - this.activationDate) > this.adjustedLife ? this.adjustedLife : (Date.now() - this.activationDate);
        let percentLifeElapsed = lifeElapsed / this.adjustedLife;
        this.size = this.startSize - (percentLifeElapsed * this.startSize);
        
        // this.size = this.size < 0 ? 0 : this.size;

        if(this.size === 0) this.active = false;
    }

}





let orbStates = [
    new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb(),
    // new Orb()
];






function setup() {
createCanvas(windowWidth, windowHeight - 100);
  background("#000");

  for(let i=0;i<numStars;i++){
    stars[i] = new Star();
  }
}






function draw() {
    background(0);

    warpEl.textContent = `WARP ${(warp * 100).toFixed(0)}`;
    warpHighscoreEl.textContent = `HIGHSCORE: ${getHighscore()}`


    if(!playing) {

        
    } else {
    
        fill('#b898f3');

        for (const orbState of orbStates) {
            orbState.update();
            circle(orbState.x, orbState.y, orbState.size);
            if(!orbState.active) {
                endGame();
            }
        }

        





    }


    // STAR RUNNER
  translate(width/2,height/2);
  for(var star of stars){
    star.update();
    star.display();
    }
  // STAR RUNNER



}



const startGame = () => {

    launchButtonEl.textContent = 'QUICK! TAP ASTEROIDS!';
    setTimeout(() => {
        launchButtonEl.textContent = 'PRESS TO LAUNCH';
        if(playing) return;
        playing = true;
        roundStartTime = Date.now();
    
        for (const orbState of orbStates) {
            orbState.activate();
            orbState.adjustedLife = orbState.totalLife;
        }
        warp = 0.1;
        launchButtonEl.hidden = true;
        
    }, 2000);

}



const endGame = () => {
    launchButtonEl.hidden = false;
    setHighscore(JSON.parse((warp * 100).toFixed(0)));
    warp = 0.01;
    for (const orbState of orbStates) {
        orbState.active = false;
        orbState.rounds = 0;
    }
    playing = false;

    launchButtonEl.textContent = 'GAME OVER';
    setTimeout(() => {
        launchButtonEl.textContent = 'PRESS TO LAUNCH';
    }, 2000);
}



// storage.setItem("highscore", 76);

// // get an item
// let highscore = storage.getItem("highscore");



let getHighscore = () => {
    let highscore = 0;
    try {
        let foundHighscore = storage.getItem("highscore");
        if(foundHighscore > 0) highscore = foundHighscore;
    } catch(err) {}
    return highscore;
}



let setHighscore = (newScore) => {
    if(newScore > getHighscore()) {
        storage.setItem("highscore", newScore);
    }
}


gameContainerEl.addEventListener('click', () => {

    if(!playing && launchButtonEl.textContent !== 'GAME OVER') {
        startGame();
    }



});



function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 100);
    background(0);
}




//detects when the mouse is pressed
function mouseClicked() {

    for (const orbState of orbStates) {
        if (dist(mouseX, mouseY, orbState.x, orbState.y) <= orbState.size) {
            orbState.activate(); 

        }
    }

  }