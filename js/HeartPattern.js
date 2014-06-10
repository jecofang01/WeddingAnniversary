"use strict";
/**
 * Created by fanggjie on 2014/6/10.
 */

WA.HeartPattern = function(view) {
    WA.Pattern.call(this, view);
    var _self = this;
    this.name = "HeartPattern";

    this._activeObjs = [];

    THREE.ImageUtils.loadTexture('res/baby.jpg', THREE.ClampToEdgeWrapping, function(texture) {
        _self.onTextureLoaded(texture);
    });
};

WA.HeartPattern.prototype = Object.create(WA.Pattern.prototype);

WA.HeartPattern.prototype.update = function(time) {
    this._activeObjs[0].mesh.position.z += 1;
    WA.Pattern.prototype.update.call(this, time);
};

WA.HeartPattern.prototype.dispose = function(){

    WA.Pattern.prototype.dispose.call(this);
};

WA.HeartPattern.prototype.onTextureLoaded = function(texture) {
    var w = texture.image.width, h = texture.image.height;
    if ( w >= h) {
        h = parseInt(16 * h / w);
        w = 16;
    } else {
        w = parseInt(16 * w / h);
        h = 16;
    }

    var geometry = new THREE.PlaneGeometry(w, h);

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        overdraw: true
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -650);
    this._container.add(mesh);
    this._activeObjs.push({mesh: mesh, texture: texture, geometry: geometry, material: material});
};