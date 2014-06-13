"use strict";
/**
 * Created by fanggjie on 2014/6/9.
 */

var WA = {
    reversion: "beta-1.0",
    author: "Jeco Fang"
};

WA.Easing = {
    Linear: function(time, startTime, duration, startValue, endValue){
        var elapsed = time - startTime;
        var change = endValue - startValue;
        return change * elapsed / duration + startValue;
    },
    LinearInOut: function(time, startTime, duration, middleValue, endValue) {
        var elapsed = time - startTime;
        var change = endValue - middleValue;
        var value = -2 * change * elapsed / duration + endValue;
        if (value >= middleValue) {
            value = 2 * change * elapsed / duration + middleValue;
        }
        return value;
    }
};

WA.Shape = {
    HeartShape:function (ratio){
        ratio = ratio !== undefined? ratio : 1;
        var x = 0, y = 0, shape;
        shape = new THREE.Shape();
        shape.moveTo(x + 25 * ratio , y + 25 * ratio);
        shape.bezierCurveTo( x + 25 * ratio, y + 25 * ratio, x + 20 * ratio, y, x, y );
        shape.bezierCurveTo( x - 30 * ratio, y, x - 30 * ratio, y + 35 * ratio,x - 30 * ratio,y + 35 * ratio );
        shape.bezierCurveTo( x - 30 * ratio, y + 55 * ratio, x - 10 * ratio, y + 77 * ratio, x + 25 * ratio, y + 95 * ratio );
        shape.bezierCurveTo( x + 60 * ratio, y + 77 * ratio, x + 80 * ratio, y + 55 * ratio, x + 80 * ratio, y + 35 * ratio );
        shape.bezierCurveTo( x + 80 * ratio, y + 35 * ratio, x + 80 * ratio, y, x + 50 * ratio, y );
        shape.bezierCurveTo( x + 35 * ratio, y, x + 25 * ratio, y + 25 * ratio, x + 25 * ratio, y + 25 * ratio );

        return shape;
    }
};