// Copyright (c) 2018 ml5
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Style Transfer Mirror Example using p5.js
This uses a pre-trained model of The Great Wave off Kanagawa and Udnie (Young American Girl, The Dance)
=== */

let style;
let video;
let isTransferring = false;
let resultImg;

let r;
let g;
let b;
let a;
let rSum = 0;
let rAvg = 0;

let gSum = 0;
let gAvg = 0;

let bSum = 0;
let bAvg = 0;

let aSum = 0;
let aAvg = 0;

let index;

let totalRs;

//p5 sound vars
//p5 sound vars
//p5 sound vars
let osc;
let osc1;
let filter, filterFreq, filterRes;
//p5 sound vars
//p5 sound vars
//p5 sound vars

function setup() {
  createCanvas(320, 240).parent('canvasContainer');
  video = createCapture(VIDEO);
  video.hide();

  //////p5 SOUND SETUP
  //////p5 SOUND SETUP
  //////p5 SOUND SETUP
    // Instantiate the envelope
    envelope = new p5.Env();
    envelope1 = new p5.Env();
    //set attackTime, decayTime, sustainRatio, releaseTime
    envelope.setADSR(10, 0.5, 0.2, 0.0);
    envelope1.setADSR(5, 0.5, 0.2, 3.0);
    //set attackLevel, releaseLevel
    envelope.setRange(1, 0);
    envelope1.setRange(1, 0);
    delay = new p5.Delay();
    filter = new p5.LowPass();
    osc = new p5.TriOsc();
    osc1 = new p5.SinOsc();
    osc.amp(0.0);
    osc.start();
    osc1.amp(0.0);
    osc1.start();
  //////p5 SOUND
  //////p5 SOUND
  //////p5 SOUND

  // The results image from the style transfer
  resultImg = createImg('');
  resultImg.hide();

  // The button to start and stop the transfer process
  select('#startStop').mousePressed(startStop);

  // Create a new Style Transfer method with a defined style.
  // We give the video as the second argument
  style = ml5.styleTransfer('models/udnie', video, modelLoaded);
  pixelDensity(1);
}

function draw(){
  video.loadPixels();
  loadPixels();
  
  // Switch between showing the raw camera or the style
  if (isTransferring) {
    image(resultImg, 0, 0, 320, 240);
  //read rgba values by running through entire width/height of the image  
    for(let x = 0; x<video.width; x++){
      for(let y = 0; y<video.height; y++){
        index = (x + y * width) * 4;
        r = video.pixels[index+0]; 
        g = video.pixels[index+1]; 
        b = video.pixels[index+2]; 
        a = video.pixels[index+3]; 
        //calculate the sum of all of the r values
        // rSum += r;
      }
    }
    //filterFreq = map (mouseY, 0, width, 10, 22050);
    filterFreq = map (g, 40, 125, 10000, 22050);

    // Map mouseY to resonance (volume boost) at the cutoff frequency
    //filterRes = map(mouseX, 0, height, 15, 5);
    filterRes = map(b, 40, 125, 15, 5);

    // set filter parameters
    filter.set(filterFreq, filterRes);


    //calculate and display the average of the r values at each frame
    rAvg = rSum/(width*height);
    console.log(r, g, b);
    
      if(r>70){
        let rMapped = map(r, 60, 255, 0, 1);
        let gMapped = map(g, 60, 255, 0, 1);
        let bMapped = map(b, 60, 255, 0, 1);
        //delay.process(osc1, .12, .7, 2300)
        delay.process(osc, rMapped, .4, g*20);
        delay.process(osc1, bMapped, .7, b*20);
        ;
        osc.amp(envelope);
        osc.freq(440);
        envelope.play(osc, 0, 0.25);
        osc1.amp(envelope1);
        osc1.freq(880);
        envelope1.play(osc1, 0, 0.25);
        
      }else{
        osc.amp(0.0);
        osc1.amp(0.0);
      }
  } else {
    image(video, 0, 0, 320, 240); 
  }

  rSum = 0;
  rAvg = 0;
}

// A function to call when the model has been loaded.
function modelLoaded() {
  select('#status').html('Model Loaded');
}

// Start and stop the transfer process
function startStop() {
  if (isTransferring) {
    select('#startStop').html('Start');
  } else {
    select('#startStop').html('Stop');
    // Make a transfer using the video
    style.transfer(gotResult); 
  }
  isTransferring = !isTransferring;
}

// When we get the results, update the result image src
function gotResult(err, img) {
  resultImg.attribute('src', img.src);
  if (isTransferring) {
    style.transfer(gotResult); 
  }
}
