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

let index;

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
    envelope.setADSR(10, 0.5, 0.2, 1.0);
    envelope1.setADSR(5, 0.5, 0.2, 3.0);
    //set attackLevel, releaseLevel
    envelope.setRange(.25, 0);
    envelope1.setRange(.25, 0);
    delay = new p5.Delay();

    filter = new p5.LowPass();
    osc = new p5.SinOsc();
    osc1 = new p5.SinOsc();
    osc2 = new p5.SinOsc();
    osc.amp(0.0);
    osc.start();
    osc1.amp(0.0);
    osc1.start();
    osc2.amp(0.0);
    osc2.start();

    osc.disconnect();
    osc.connect(filter);
    osc1.disconnect();
    osc1.connect(filter);
    osc2.disconnect();
    osc2.connect(filter);

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
    calcPixels();
    mapFilter();
    playNotes();
    // if(frameCount % 60 == 0){
    //   console.log(r, g, b, filterRes, filterFreq);
    // }
    
  } else {
    image(video, 0, 0, 320, 240); 
  }
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

function calcPixels(){
  for(let x = 0; x<video.width; x++){
    for(let y = 0; y<video.height; y++){
      index = (x + y * video.width) * 4;
      r = video.pixels[index+0]; 
      g = video.pixels[index+1]; 
      b = video.pixels[index+2]; 
      a = video.pixels[index+3]; 
    }
  }

}

function mapFilter(){
 //filterFreq = map (mouseY, 0, width, 10, 22050);
 filterFreq = floor(map(g, 0, 255, 10, 22050));

 // Map mouseY to resonance (volume boost) at the cutoff frequency
 //filterRes = map(mouseX, 0, height, 15, 5);
 filterRes = floor(map(b, 0, 255, 5, 1));

 // set filter parameters
 filter.set(filterFreq, filterRes);

}

function playNotes(){
  if(r>20 && r <= 255){
    let rMapped = map(r, 0, 255, 0, .99);
    let gMapped = map(g, 0, 255, 0, .99);
    let bMapped = map(b, 0, 255, 0, .99);
    //delay.process(osc1, .12, .7, 2300)
    delay.process(osc, rMapped, .7, g*20);
    delay.process(osc1, bMapped, .7, b*20);
    delay.process(osc2, bMapped, .7, b*20);
    //Gminor scale setup (G, A, B♭, C, D, E♭, and F)
    let scale = [196.00, 196*2, 220.00*2, 233.08, 261.63*2, 293.66, 311.13*2, 349.23*2];
    let rScale = floor(random(0, scale.length));
    osc.amp(envelope);
    osc.freq(scale[rScale]);
    envelope.play(osc, 0, 0.1);
    osc1.amp(envelope1);
    osc1.freq(scale[rScale]);
    envelope1.play(osc1, 0, 0.1);
    osc2.amp(envelope1);
    osc2.freq(scale[rScale]);
    envelope1.play(osc2, 0, 0.1);
   
    
  }else{
    osc.amp(0.0);
    osc1.amp(0.0);
    osc2.amp(0.0);
  }

}



