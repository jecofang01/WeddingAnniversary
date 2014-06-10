"use strict";
/**
 * Created by fanggjie on 2014/6/10.
 */

WA.HeartPattern = function(view) {
    WA.Pattern.call(this, view);

    this.name = "HeartPattern";

    this._geometry = new THREE.PlaneGeometry(16, 16);
    
};

WA.HeartPattern.prototype = Object.create(WA.Pattern.prototype);

WA.HeartPattern.prototype.update = function(time) {

    WA.Pattern.prototype.update.call(this, time);
};

WA.HeartPattern.prototype.dispose = function(){

    WA.Pattern.prototype.dispose.call(this);
};