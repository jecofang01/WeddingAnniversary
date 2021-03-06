"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

WA.Pattern = function(view, textureManager) {
    this._view = view;
    this._textureManager = textureManager !== undefined? textureManager: undefined;
    this._name = "";
    this._container = new THREE.Object3D();

    this._view.addToScene(this._container);
};

WA.Pattern.prototype = {
    constructor: WA.Pattern,

    update: function(time) {
        this.dispatchEvent({type:'update', time: time});
    },

    dispose: function(){
        this._view.removeFromScene(this._container);
        this.dispatchEvent({type:'dispose'});
    }
};

THREE.EventDispatcher.prototype.apply(WA.Pattern.prototype);