"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

WA.TimerPattern = function(view) {
    WA.Pattern.call(this, view);

    this.name = "TimerPattern";
    this._startTime = new Date(2013, 6, 16, 0, 0 ,0 ,0).getTime();
    this._lastDiffDay = 0;
    this._material = new THREE.MeshFaceMaterial( [
        new THREE.MeshLambertMaterial( { color: 0xff0000, shading: THREE.FlatShading, opacity: 0.95 } ),
        new THREE.MeshLambertMaterial( { color: 0xff0000 } )
    ] );
    this._needsUpdate = false;

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0, -1, 1 );
    directionalLight.position.normalize();
    this._container.add( directionalLight );

    var pointLight = new THREE.PointLight( 0xffffff, 2, 300 );
    pointLight.position.set( 0, 0, 0 );
    this._container.add( pointLight );

    this.__createOrUpdateTextMesh();
};

WA.TimerPattern.prototype = Object.create(WA.Pattern.prototype);

WA.TimerPattern.prototype.update = function(time) {
    //add update code here
    this.__createOrUpdateTextMesh(time);
    WA.Pattern.prototype.update.call(this, time);
};

WA.TimerPattern.prototype.dispose = function(){
    //add dispose code here
    this._container.remove(this._textMesh);
    this._textGeometry.dispose();
    this._material.dispose();
    WA.Pattern.prototype.dispose.call(this);
};

WA.TimerPattern.prototype.__generateGeometry = function(time){
    var now = time !== undefined? time: Date.now();
    var diffDay = parseInt((now - this._startTime) / 1000 / 60 / 60 / 24);
    if (this._lastDiffDay === 0 || this._lastDiffDay != diffDay) {
        this._lastDiffDay = diffDay;
        if (this._textGeometry != null && this._textGeometry instanceof THREE.TextGeometry) {
            this._textGeometry.dispose();
            this._textGeometry = null;
        }
        var text = 'Together ' + diffDay + " Days";
        this._textGeometry = new THREE.TextGeometry(text, {
            size: 32,
            height: 16,
            curveSegments: 4,
            font: "helvetiker",

            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 2,

            material: 0,
            extrudeMaterial: 1
        });
        this._needsUpdate = true;
    }
};

WA.TimerPattern.prototype.__createOrUpdateTextMesh = function(time){
    this.__generateGeometry(time);
    if (this._needsUpdate) {
        this._textGeometry.computeVertexNormals();
        this._textGeometry.computeBoundingBox();

        if(this._textMesh !== undefined) {
            this._container.remove(this._textMesh);
        }

        var centerOffset = -0.5 * ( this._textGeometry.boundingBox.max.x - this._textGeometry.boundingBox.min.x );
        this._textMesh = new THREE.Mesh( this._textGeometry, this._material );
        this._textMesh.position.set(centerOffset, 0, -650);
        this._container.add(this._textMesh);
        this._needsUpdate = false;
    }
};