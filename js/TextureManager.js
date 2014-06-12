"use strict";
/**
 * File: TextureManager.js
 * Author: Jeco Fang
 * Email: jeco.fang@163.com
 * Date: 2014/6/11.
 */

WA.TextureManager = function() {
    this.URLARRAY = ['0.jpg','1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'];//,'7.jpg','8.jpg','9.jpg','10.jpg'];//,'11.jpg',
        //'12.jpg','13.jpg','14.jpg','15.jpg','16.jpg'];
    this.__textureArray = [];
};

WA.TextureManager.prototype = {
    constructor: WA.TextureManager,

    loadTexture: function() {
        var _self = this;
        for(var i = 0; i < this.URLARRAY.length; i++){
            var url = 'res/' + this.URLARRAY[i];
            THREE.ImageUtils.loadTexture(url, THREE.ClampToEdgeWrapping, function(texture) {
                _self.__textureArray.push( texture);
                if (_self.__textureArray.length === _self.URLARRAY.length) {
                    _self.dispatchEvent({type:'textureLoaded'});
                }
            });
        }
    },

    getTextureArray: function() {
        return this.__textureArray;
    },

    dispose: function() {
        while(this.__textureArray.length != 0) {
            var texture = this.__textureArray.pop();
            texture.dispose();
        }
    }
};


THREE.EventDispatcher.prototype.apply(WA.TextureManager.prototype);