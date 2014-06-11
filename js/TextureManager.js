"use strict";
/**
 * File: TextureManager.js
 * Author: Jeco Fang
 * Email: jeco.fang@163.com
 * Date: 2014/6/11.
 */

WA.TextureManager = function() {
    this.URLARRAY = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'];
    this.__textureArray = [];
    this.__textrueLoadComplete = false;
};

WA.TextureManager.prototype = {
    constructor: WA.TextureManager,

    loadTexture: function() {
        var _self = this;
        for(var i = 0; i < this.URLARRAY.length; i++){
            var url = 'res/' + this.URLARRAY[i];
            THREE.ImageUtils.loadTexture(url, THREE.ClampToEdgeWrapping, function(texture) {
                _self.__textureArray.push(texture);
                if (_self.__textureArray.length === _self.URLARRAY.length) {
                    _self.__textrueLoadComplete = true;
                    _self.dispatchEvent({type:'textureLoaded'});
                }
            });
        }
    },

    getTextureArray: function() {
        return this.__textureArray;
    },

    dispose: function() {
        for(var i = 0; i < this.textureArray.length; i++) {
            this.textureArray[i].dispose();
        }
    }
};


THREE.EventDispatcher.prototype.apply(WA.TextureManager.prototype);