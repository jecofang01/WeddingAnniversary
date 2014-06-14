"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

WA.TextPattern = function(view) {
    WA.Pattern.call(this, view);

    this.name = "TextPattern";
    this._startTime = new Date('6/16/2013').getTime();
    this._lastDiffDay = 0;
    this._material = new THREE.MeshFaceMaterial( [
        new THREE.MeshLambertMaterial( { color: 0xff0000, shading: THREE.FlatShading, opacity: 0.95 } ),
        new THREE.MeshLambertMaterial( { color: 0xff0000 } )
    ] );

    this._meshList = [];

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0, -1, 1 );
    directionalLight.position.normalize();
    this._container.add( directionalLight );

    var pointLight = new THREE.PointLight( 0xffffff, 2, 300 );
    pointLight.position.set( 0, 0, 0 );
    this._container.add( pointLight );

    this.__createConstTextMesh();
    this.__createOrUpdateTextMesh();
};

WA.TextPattern.prototype = Object.create(WA.Pattern.prototype);

WA.TextPattern.prototype.update = function(time) {
    //add update code here
    this.__createOrUpdateTextMesh(time);
    WA.Pattern.prototype.update.call(this, time);
};

WA.TextPattern.prototype.dispose = function(){
    //add dispose code here
    while(this._meshList.length !== 0){
        var mesh = this._meshList.pop();
        this._container.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
    }
    WA.Pattern.prototype.dispose.call(this);
};

WA.TextPattern.prototype.__createOrUpdateTextMesh = function(time){
    var now = time !== undefined? time: Date.now();
    var diffDay = parseInt((now - this._startTime) / 1000 / 60 / 60 / 24);
    if (this._lastDiffDay === 0 || this._lastDiffDay != diffDay) {
        this._lastDiffDay = diffDay;
        //remove and dispose the previous mesh
        if (this._meshList.length === 3 && this._meshList[2] instanceof THREE.Mesh) {
            var removed = this._meshList.pop();
            this._container.remove(removed);
            removed.geometry.dispose();
        }
        var text = diffDay.toString();
        var geometry = this.__createTextGeometry(text);

        var centerOffsetX = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        var mesh = new THREE.Mesh( geometry, this._material );
        mesh.position.set(centerOffsetX, 0, -50);
        this._container.add(mesh);
        this._meshList.push(mesh);

        this.__computeMeshOffsetY();
    }
};

WA.TextPattern.prototype.__createConstTextMesh = function () {
    var texts = ["Married", "Days"], i, centerOffsetX, geometry;
    for (i = 0; i < texts.length; i++ ) {
        geometry = this.__createTextGeometry(texts[i]);
        centerOffsetX = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        var mesh = new THREE.Mesh(geometry, this._material);
        mesh.name = texts[i];
        mesh.position.set(centerOffsetX, 0, -50);
        this._meshList.push(mesh);
        this._container.add(mesh);
    }
};

WA.TextPattern.prototype.__createTextGeometry = function (text) {
    var geometry = new THREE.TextGeometry(text, {
        size: 72,
        height: 25,
        curveSegments: 4,
        font: "helvetiker",

        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,

        material: 0,
        extrudeMaterial: 1
    });
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    return geometry;
};

WA.TextPattern.prototype.__computeMeshOffsetY = function() {
    if (this._meshList.length === 3){
        var top = this._meshList[0],
            bottom = this._meshList[1],
            center = this._meshList[2];

        var topH = top.geometry.boundingBox.max.y - top.geometry.boundingBox.min.y;
        var centerH = center.geometry.boundingBox.max.y - center.geometry.boundingBox.min.y;
        var bottomH = bottom.geometry.boundingBox.max.y - bottom.geometry.boundingBox.min.y;
        var topOffset = 0.5 * centerH + 10;
        var centerOffset = -0.5 * centerH;
        var bottomOffset = -0.5 * centerH - bottomH;
        top.position.y = topOffset;
        center.position.y = centerOffset;
        bottom.position.y = bottomOffset;
    }
};