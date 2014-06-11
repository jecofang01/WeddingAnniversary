"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

WA.View = function(width, height, container){
    this._width = width;
    this._height = height;
    this._container = container;

    this._camera = new THREE.PerspectiveCamera(70,this._width/this._height, 1, 2000);
    this._camera.position.set(0, 0, 400);
    this._scene = new THREE.Scene();
    this._scene.add(this._camera);

    this._textureManager = new WA.TextureManager();
    this._textureManager.loadTexture();

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
        var patternText = new WA.TextPattern(this);
        this._patterns.push(patternText);

        var patternHeart = new WA.HeartPattern(this, this._textureManager);
        this._patterns.push(patternHeart);

        var patternBackground = new WA.BackgroundPattern(this, this._textureManager);
        this._patterns.push(patternBackground);
    }
};