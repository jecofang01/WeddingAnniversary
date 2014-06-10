"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

WA.View = function(width, height, container){
    this._width = width;
    this._height = height;
    this._container = container;

    this._camera = new THREE.PerspectiveCamera(45,this._width/this._height, 0.1, 10000);
    this._camera.position.set(0, 0, 7);
    this._scene = new THREE.Scene();
    this._scene.add(this._camera);

    this._patterns = [];
    this.createPattern();

    this._renderer = new THREE.WebGLRenderer({antialias: true});
    this._renderer.setSize(this._width, this._height);

    this._renderer.domElement.style.position = "absolute";
    this._renderer.domElement.style.top = 0;
    this._renderer.domElement.style.left = 0;
    this._container.appendChild(this._renderer.domElement);
};

WA.View.prototype = {
    constructor: WA.View,

    setSize: function(width, height) {
        this._width = width;
        this._height = height;
        if (this._camera !== undefined && this._camera instanceof THREE.Camera) {
            this._camera.aspect = this._width / this._height;
            this._camera.updateProjectionMatrix();
        }
        if (this._renderer !== undefined && this._renderer instanceof THREE.WebGLRenderer) {
            this._renderer.setSize(width, height);
        }
    },

    addToScene: function(obj) {
        if (obj instanceof THREE.Object3D) {
            this._scene.add(obj);
        }
    },

    removeFromScene: function(obj) {
        this._scene.remove(obj);
    },

    animate: function() {
        var _self = this;
        requestAnimationFrame(function(){
            _self.animate();
        });

        _self.update(Date.now());
    },

    update: function(time){
        for(var i = 0; i < this._patterns.length; i++) {
            this._patterns[i].update(time);
        }
        this.render();
    },

    render: function(){
        this._renderer.render(this._scene, this._camera);
    },

    createPattern: function(){
        var patternTimer = new WA.TimerPattern(this);
        this._patterns.push(patternTimer);

        var patternHeart = new WA.HeartPattern(this);
        this._patterns.push(patternHeart);
    }
};