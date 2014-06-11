"use strict";
/**
 * File: BackgroundPattern.js
 * Author: Jeco Fang
 * Email: jeco.fang@163.com
 * Date: 2014/6/11.
 */

WA.BackgroundPattern = function(view, textureManager) {
    WA.Pattern.call(this, view, textureManager);
    this._name = "BackgroundPattern";

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

    var geometry = new THREE.PlaneGeometry(this._view._width, this._view._height);
    var material = new THREE.ShaderMaterial({
        uniforms: {
            texture: {type: "t", value: 0},
            opacity: {type: "f", value: 0.5}
        },
        vertexShader: this._VERTEX_SHADER,
        fragmentShader: this._FRAGMENT_SHADER,
        transparent: true
    });

    this._textureManager.addEventListener('textureLoaded', function(){
        material.uniforms.texture = this.getTextureArray()[0];
    });

    this._mesh = new THREE.Mesh(geometry, material);
    this._container.add(this._mesh);
};

WA.BackgroundPattern.prototype = Object.create(WA.Pattern.prototype);