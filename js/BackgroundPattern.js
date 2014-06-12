"use strict";
/**
 * File: BackgroundPattern.js
 * Author: Jeco Fang
 * Email: jeco.fang@163.com
 * Date: 2014/6/11.
 */

WA.BackgroundPattern = function(view, textureManager) {
    var _self = this;
    WA.Pattern.call(this, view, textureManager);

    this._VERTEX_SHADER = [
        "varying vec2 _uv;",
        "void main() {",
        "    _uv = uv;",
        "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
        "}"
    ].join("\n");

    this._FRAGMENT_SHADER = [
        "uniform sampler2D texture;",
        "uniform float opacity;",
        "varying vec2 _uv;",
        "void main() {",
        "    vec3 color = texture2D(texture, _uv).rgb;",
        "    gl_FragColor.xyz = color * 0.15 + vec3(0.1, 0.1, 0.1) * 0.85;",
        "    gl_FragColor.w = opacity;",
        "}"
    ].join("\n");
    this._LIEFTIME = 20 * 1000;

    this._startTime = 0;

    this._name = "BackgroundPattern";
    this._textureLoadComplete = false;
    this._textureManager.addEventListener('textureLoaded', function(){
        _self._textureLoadComplete = true;
    });

    this._textureArray = this._textureManager.getTextureArray();

    this._material = new THREE.ShaderMaterial({
        uniforms: {
            texture: {type: "t", value: 0},
            opacity: {type: "f", value: 0.5}
        },
        vertexShader: this._VERTEX_SHADER,
        fragmentShader: this._FRAGMENT_SHADER,
        transparent: true
    });

    //this._material2 = this._material.clone();
};

WA.BackgroundPattern.prototype = Object.create(WA.Pattern.prototype);

WA.BackgroundPattern.prototype.update = function (time) {
    if (this._textureLoadComplete) {
        if (this._startTime === 0) {
            this.__createBackgroundMesh(time);
        } else if (time >= (this._LIEFTIME + this._startTime)) {
            if (this._mesh !== undefined) {
                this._container.remove(this._mesh);
                this._mesh.geometry.dispose();
            }
            this.__createBackgroundMesh(time);
        } else {
            var v = WA.Easing.Linear(time, this._startTime, this._LIEFTIME, 1, 0.1);
            console.log('opacity' + v);
            this._mesh.material.uniforms.opacity.value = v;
            this._mesh.material.needsUpdate = true;
            this._mesh.scale.x = WA.Easing.Linear(time, this._startTime, this._LIEFTIME, 1,  2);
            this._mesh.scale.y = WA.Easing.Linear(time, this._startTime, this._LIEFTIME, 1,  2);
        }
    }

    WA.Pattern.prototype.update.call(this, time);
};

WA.BackgroundPattern.prototype.dispose = function(){
    if (this._mesh !== undefined) {
        this._container.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh.material.dispose();
    }
    WA.Pattern.prototype.dispose.call(this);
};

WA.BackgroundPattern.prototype.__createBackgroundMesh = function(time){
    var index = parseInt(Math.random() * this._textureArray.length);
    var texture = this._textureArray[index];
    var vW = this._view._width, vH = this._view._height,
        tW = texture.image.width, tH = texture.image.height;
    var w = tW, h = tH;
    if (vW < tW && vH < tH) {
        var aspect = 0;
        if(tW >= tH){
            aspect = vW / tW;
        } else {
            aspect = vH / tH;
        }
        w *= aspect;
        h *= aspect;
    }

    var geometry = new THREE.PlaneGeometry(w, h);
    this._mesh = new THREE.Mesh(geometry, this._material);
    this._mesh.position.z = -51;
    this._material.uniforms.texture.value = texture;
    this._material.uniforms.opacity.value = 1;
    this._material.needsUpdate = true;

    this._container.add(this._mesh);
    this._startTime = time;
};
