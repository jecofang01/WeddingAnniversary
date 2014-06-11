"use strict";
/**
 * Created by fanggjie on 2014/6/10.
 */

WA.HeartPattern = function(view) {
    WA.Pattern.call(this, view);

    this._URLS = ['baby.jpg','dog.jpg'];

    this.name = "HeartPattern";
    this._textrues = [];
    this.__createHeartShape();
    this.__loadTextures();
};

WA.HeartPattern.prototype = Object.create(WA.Pattern.prototype);

WA.HeartPattern.prototype.update = function(time) {
    if (this.__timeOnShapePath !== undefined) {
        this.__timeOnShapePath += 0.0337;
        if (this.__timeOnShapePath > 1) {
            this.__timeOnShapePath -= 1;
        }
        var pointOnShape = this._heartShape.getPointAt(this.__timeOnShapePath);
        console.log('x =' + pointOnShape.x + '; y =' + pointOnShape.y);
        this._emitterpos.x = pointOnShape.x * 3 - 100;
        this._emitterpos.y = -pointOnShape.y * 3 + 200;
    }
    WA.Pattern.prototype.update.call(this, time);
};

WA.HeartPattern.prototype.dispose = function() {

    WA.Pattern.prototype.dispose.call(this);
};

WA.HeartPattern.prototype.__loadTextures = function() {
    var _self = this;
    for(var i = 0; i < this._URLS.length; i++){
        var url = 'res/' + this._URLS[i];
        THREE.ImageUtils.loadTexture(url, THREE.ClampToEdgeWrapping, function(texture) {
            _self._textrues.push(texture);
            if (_self._textrues.length === _self._URLS.length) {
                _self.__onTexturesLoaded();
            }
        });
    }
};

WA.HeartPattern.prototype.__onTexturesLoaded = function() {
    this.__timeOnShapePath = 0;
    var _self = this;
    var createParticle = function() {
        var index = parseInt(Math.random() * _self._textrues.length);
        var texture = _self._textrues[index];
        var w = texture.image.width, h = texture.image.height;
        if (w >= h) {
            h = 16 * h / w;
            w = 16;
        } else {
            w = 16 * w / h;
            h = 16;
        }
        var geometry = new THREE.PlaneGeometry(w, h);
        var material = new THREE.MeshBasicMaterial({
            map: _self._textrues[index]
        });
        var particle = new THREE.Mesh(geometry, material);
        particle.position.z = -400;
        _self._container.add(particle);

        return particle;
    };

    var onParticleCreated = function(particle) {
        var position = particle.position;
        particle.target.position = position;
    };

    var onParticleDead = function(particle) {
        particle.target.visible = false;
        _self._container.remove(particle.target);
    };

    var sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(160));
    _self._emitterpos = new THREE.Vector3(0, 0, -400);
    sparksEmitter.addInitializer(new SPARKS.Position( new SPARKS.PointZone( _self._emitterpos ) ) );
    sparksEmitter.addInitializer(new SPARKS.Lifetime(0,2));
    sparksEmitter.addInitializer(new SPARKS.Target(null, createParticle));

    sparksEmitter.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(0,-50, -200))));

    sparksEmitter.addAction(new SPARKS.Age());
    //sparksEmitter.addAction(new SPARKS.Accelerate(0.2));
    sparksEmitter.addAction(new SPARKS.Move());
    sparksEmitter.addAction(new SPARKS.RandomDrift(50,50,200));

    sparksEmitter.addCallback("created", onParticleCreated);
    sparksEmitter.addCallback("dead", onParticleDead);
    sparksEmitter.start();
    _self._sparksEmitter = sparksEmitter;
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