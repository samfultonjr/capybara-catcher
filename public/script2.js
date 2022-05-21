let numStars = 800;
let stars = [];

let warp = 0.01;

let started = false;
let playing = false;

let roundStartTime = 0;

let lastHit = 0;

let storage = window.localStorage;

const gameContainerEl = document.querySelector('.game-container');

const warpEl = document.querySelector('.game-warp');
const launchButtonEl = document.querySelector('.game-launch-button');
const warpHighscoreEl = document.querySelector('.game-warp-highscore');


let recording = false;






  const setRecordMode = () => {
    launchButtonEl.classList.add('game-launch-button-record-mode');
    document.querySelector('.top-bar').classList.add('top-bar-record-mode');
    document.querySelector('.game-container').classList.add('game-container-record-mode');
    document.querySelector('.logo').classList.add('logo-record-mode');
    document.querySelector('.game-warp').classList.add('game-warp-record-mode');
    document.querySelector('.game-warp-highscore').classList.add('game-warp-highscore-record-mode');
    document.querySelector('.game-watermark').classList.add('game-watermark-record-mode');
  }


  try {
    const urlParams = new URLSearchParams(window.location.search);
    const recordParam = urlParams.get('record');
    if(recordParam === 'true') {
        recording = true;
        setRecordMode();
    }
  } catch (err) {

  }



function Star(){
    this.dist = random(width+height);
    this.angle = random(0,2*PI);
    this.speed = random(0*warp,0.3*warp);
    this.bright = 0;
    this.weight = random(2,6);

    this.color;
    
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
        this.weight = random(2,6);
      }
  
    }
    
    this.colormap = function(b){
        if(!this.color) {
            let random = Math.random();
            if(random > 0.1) {
                this.color = '#fff';
            } else {
                this.color = '#de76f8';
            }
        }
    
    return this.color;
    //   colorMode(HSB);
    //   sat = map(warp,1,7,0,100);
    //   return color(200,sat,b);
    
    }
  }



class Orb {
    x = 300;
    y = 300;

    active = false;
    activationDate = 0;

    totalLife = 2000;
    
    adjustedLife = 0;

    startSize = JSON.parse(document.documentElement.clientWidth * 0.15);
    size = 0;

    rounds = 0;

    color = '#c300ff';


    totalScalar = 30;
        
    angle = 0;	// initialize angle variable
    scalar = 20;  // set the radius of circle
    startX = 200;	// set the x-coordinate for the circle center
    startY = 200;	// set the y-coordinate for the circle center

    activate () {
        this.angle = 0;


        this.active = true;
        this.activationDate = Date.now();
        this.size = this.startSize;
        this.startX = Math.random() * width;
        this.startY = (Math.random() * (height - 75));
        // rounds++;
        warp = JSON.parse((warp + 0.01).toFixed(2));
        this.adjustedLife = this.adjustedLife * 0.98;
        // this.scalar = this.scalar * 0.98;

        let random = Math.random();
        if(random > 0.8) {
            this.color = '#c300ff';
        } else {
            this.color = '#9366e9';
        }
    }


    update () {



        let lifeElapsed = (Date.now() - this.activationDate) > this.adjustedLife ? this.adjustedLife : (Date.now() - this.activationDate);
        let percentLifeElapsed = lifeElapsed / this.adjustedLife;
        this.size = this.startSize - (percentLifeElapsed * this.startSize);
        
        // this.size = this.size < 0 ? 0 : this.size;

        if(this.size === 0) this.active = false;


        this.x = this.startX + this.scalar * cos(this.angle);
        this.y = this.startY + this.scalar * sin(this.angle);
        this.angle += 10;
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
createCanvas(windowWidth, windowHeight - 75);
  background("#000");

  for(let i=0;i<numStars;i++){
    stars[i] = new Star();
  }
}



let lastVacDraw = 0;


let vacCircles = [

];



let holdStart;




function draw() {
    background(0);
    if(Date.now() - lastHit < 100) {
        background('#080114');
    }
  
  

    warpEl.textContent = `WARP ${(warp * 100).toFixed(0)}`;
    warpHighscoreEl.textContent = `HIGHSCORE: ${getHighscore()}`


    if((Date.now() - lastVacDraw) > 300 && mouseIsPressed) {
        if(vacCircles.length > 25) {
            vacCircles.shift();
        }
   
        vacCircles.push({x: mouseX, y: mouseY});
   
    }

    let i = 0;

    for (const vacCircle of vacCircles) {
       
        r = random(255); // r is a random number between 0 - 255
        g = random(100,200); // g is a random number betwen 100 - 200
        b = random(100); // b is a random number between 0 - 75
        // a = random(200,255); // a is a random number between 200 - 255

        a = (i / vacCircles.length) * 255;
        
        noStroke();
        fill(r, g, b, a);
        circle(vacCircle.x, vacCircle.y, 20);
        i++;
    }

    if(!playing) {

        
    } else {
    



        angleMode(DEGREES);
        for (const orbState of orbStates) {
            orbState.update();
            // circle(orbState.x, orbState.y, orbState.size);
            
  
            
            // let random = Math.random();
            // if(random > 0.6) {
            //     fill('#b898f3');
            // } else {
            //     fill('#7D6EE7');
            // }

            // fill('#c300ff');
            
            fill(orbState.color);
            
            ellipse(orbState.x, orbState.y, orbState.size);
            

            if (dist(mouseX, mouseY, orbState.x, orbState.y) <= orbState.size) {
                // got!
                lastHit = Date.now();
                orbState.activate(); 
            }
            
            if(!orbState.active) {
                endGame();
            }

            if(!mouseIsPressed) {
                endGame();
            }
        }

        angleMode(RADIANS);

        



    




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
    if(started) return;
    started = true;
    launchButtonEl.textContent = 'LETTING GO WILL END GAME';

    setTimeout(() => {
        launchButtonEl.textContent = 'YOU ARE NOW A SPACE SNAKE';
    }, 2000);


    setTimeout(() => {
        launchButtonEl.textContent = 'GRAB SPACE FOOD';
    }, 3500);

    setTimeout(() => {
        launchButtonEl.textContent = 'OR DIE';
    }, 5500);


    // THIS TIMEOUT NEEDS TO BE REMOVED IF GAME STOPPED, SHOULD NOT BE TIMEOUTS

    setTimeout(() => {
        launchButtonEl.textContent = 'HOLD TO LAUNCH';
        if(playing) return;
        playing = true;
        roundStartTime = Date.now();
    
        for (const orbState of orbStates) {
            orbState.activate();
            orbState.adjustedLife = orbState.totalLife;
        }
        warp = 0.1;
        launchButtonEl.textContent = '';
        
    }, 6000);

}



const endGame = () => {
    // launchButtonEl.textContent = ''
    setHighscore(JSON.parse((warp * 100).toFixed(0)));
    launchButtonEl.textContent = `GAME OVER \nSCORE: ${JSON.parse((warp * 100).toFixed(0))}`;
    warp = 0.01;
    for (const orbState of orbStates) {
        orbState.active = false;
        orbState.rounds = 0;
    }
    playing = false;
    started = false;


    setTimeout(() => {
        launchButtonEl.textContent = 'HOLD TO LAUNCH';
    }, 3000);
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
        // startGame();
    }



});



function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 75);
    background(0);
}




//detects when the mouse is pressed
// function mouseClicked() {

//     console.log('PENIS')
//     if(!playing) {
//         for (let i = 0; i < 100; i++) {
            
//         }
//     }

//   }


// let startLoop = () => {

// };



// setTimeout(() => {
//     startLoop();
// }, 100);

let lastMouseRelease = 0;


async function mousePressed() {

    if(!playing) {
        let mousePress = Date.now();


        for (let i = 0; i < 5; i++) {
            if(lastMouseRelease > mousePress) {
                // launchButtonEl.textContent = 'HOLD TO LAUNCH';
                return;
            };
            // launchButtonEl.textContent ='HOLD';
    
            await sleep(100);
        }
    
        startGame();
    
    }


    // if(mouseIsPressed && !playing) {
    //     debugger;
    //     if(!holdStart) {
    //         holdStart = Date.now();
    //     } else {

    //         if((Date.now() - holdStart) > 3000) {
    //             startGame();
    //             holdStart = null;
    //         }

    //     }
    // } else {
    //     // playing or mouse isn't pressed
    //     holdStart = null;
    // }
}


function mouseReleased() {
    lastMouseRelease = Date.now();
}



const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }





