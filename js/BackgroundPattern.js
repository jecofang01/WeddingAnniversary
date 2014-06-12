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
    this._LIEFTIME = 5 * 1000;

    this._startTime = 0;

    this._name = "BackgroundPattern";
    this._textureLoadComplete = false;
    this._textureManager.addEventListener('textureLoaded', function(){
        _self._textureLoadComplete = true;
    });

    this._textureArray = this._textureManager.getTextureArray();
};

WA.BackgroundPattern.prototype = Object.create(WA.Pattern.prototype);

WA.BackgroundPattern.prototype.update = function (time) {
    if (this._textureLoadComplete) {
        if (this._startTime === 0) {
            this.__createBackgroundMesh(time);
        } else if (time >= (this._LIEFTIME + this._startTime)) {
            this.dispose();
            this.__createBackgroundMesh(time);
        } else {
            this._mesh.material.uniforms.opacity.value = this.easeOutSin(time, this._startTime, this._LIEFTIME, 0.5, 0);
            this._mesh.material.needsUpdate = true;
        }
    }

    WA.Pattern.prototype.update.call(this, time);
};

WA.BackgroundPattern.prototype.dispose = function(){
    if (this._mesh !== undefined) {
        this._container.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh.material.dispose();

        this._startTime = 0;
    }
    WA.Pattern.prototype.dispose.call(this);
};

WA.BackgroundPattern.prototype.__createBackgroundMesh = function(time){
    var index = parseInt(Math.random() * this._textureArray.length);
    var texture = this._textureArray[index];
    var vW = this._view._width, vH = this._view._height,
        tW = texture.image.width, tH = texture.image.height;
    var w,h;
    if (vW >= tW || vH >= tH) {
        w = tW;
        h = tH;
    } else {
        w = vW;
        h = tH * tW / vW;
    }

    var geometry = new THREE.PlaneGeometry(w, h);
    var material = new THREE.ShaderMaterial({
        uniforms: {
            texture: {type: "t", value: texture},
            opacity: {type: "f", value: 0.5}
        },
        vertexShader: this._VERTEX_SHADER,
        fragmentShader: this._FRAGMENT_SHADER,
        transparent: true
    });

    this._mesh = new THREE.Mesh(geometry, material);
    this._container.add(this._mesh);

    this._startTime = time;
};

WA.BackgroundPattern.prototype.easeOutSin = function (time, startTime, duration ,startValue, endValue) {
    var elapsed = time - startTime;
    var change = endValue - startValue;
    return change * Math.sin((elapsed / duration * (Math.PI / 2))) + startValue;
};
