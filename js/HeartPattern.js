"use strict";
/**
 * Created by fanggjie on 2014/6/10.
 */

WA.HeartPattern = function(view, textureManager) {
    WA.Pattern.call(this, view, textureManager);
    var _self = this;

    this.name = "HeartPattern";
    this._textrues = this._textureManager.getTextureArray();
    this.__timeOnShapePath = 0;
    this._emitterpos = new THREE.Vector3(0, 0, -40);

    var onTextureLoaded = function() {
        sparksEmitter.start();
    };
    this._textureManager.addEventListener('textureLoaded', onTextureLoaded);

    this.__createHeartShape();

    var createParticle = function() {
        var index = parseInt(Math.random() * _self._textrues.length);
        var texture = _self._textrues[index];
        var w = texture.image.width, h = texture.image.height;
        if (w >= h) {
            h = 60 * h / w;
            w = 60;
        } else {
            w = 60 * w / h;
            h = 60;
        }
        var geometry = new THREE.PlaneGeometry(w, h);
        var material = new THREE.MeshBasicMaterial({
            map: texture
        });
        var particle = new THREE.Mesh(geometry, material);
        _self._container.add(particle);

        return particle;
    };

    var onParticleCreated = function(particle) {
        particle.target.position = particle.position;
    };

    var onParticleDead = function(particle) {
        var mesh = particle.target;
        mesh.visible = false;
        _self._container.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();

    };

    var sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(60));
    sparksEmitter.addInitializer(new SPARKS.Position( new SPARKS.PointZone( _self._emitterpos ) ) );
    sparksEmitter.addInitializer(new SPARKS.Lifetime(3, 5));
    sparksEmitter.addInitializer(new SPARKS.Target(null, createParticle));

    sparksEmitter.addAction(new SPARKS.Age());
    sparksEmitter.addAction(new SPARKS.Move());
    sparksEmitter.addAction(new SPARKS.RandomDrift(50,50,200));

    sparksEmitter.addCallback("created", onParticleCreated);
    sparksEmitter.addCallback("dead", onParticleDead);
    _self._sparksEmitter = sparksEmitter;
};

WA.HeartPattern.prototype = Object.create(WA.Pattern.prototype);

WA.HeartPattern.prototype.update = function(time) {
    if (this.__timeOnShapePath !== undefined) {
        this.__timeOnShapePath += 0.037;
        if (this.__timeOnShapePath > 1) {
            this.__timeOnShapePath -= 1;
        }
        var pointOnShape = this._heartShape.getPointAt(this.__timeOnShapePath);
        this._emitterpos.x = pointOnShape.x * 6 - 150;
        this._emitterpos.y = -pointOnShape.y * 6 + 280;
    }
    WA.Pattern.prototype.update.call(this, time);
};

WA.HeartPattern.prototype.dispose = function() {

    WA.Pattern.prototype.dispose.call(this);
};

WA.HeartPattern.prototype.__createHeartShape = function (){
    var x = 0, y = 0, shape;
    shape = new THREE.Shape();
    shape.moveTo(x + 25, y + 25);
    shape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
    shape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
    shape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
    shape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
    shape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
    shape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

    this._heartShape = shape;
};