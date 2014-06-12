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