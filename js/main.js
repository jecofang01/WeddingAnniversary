"use strict";

if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
} else {
    var container = document.getElementById('container');
    var view = new WA.View(window.innerWidth, window.innerHeight, container);
    view.animate();

    window.addEventListener("resize", function(){
       view.setSize(window.innerWidth, window.innerHeight);
    });
}