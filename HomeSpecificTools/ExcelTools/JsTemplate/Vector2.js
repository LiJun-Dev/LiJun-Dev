var Vector2 = require("./../JsUtils/TypeTemplate").extend({
    Parse: function(str) {
        var strArr = str.split(",");
        console.log(strArr);
        if(strArr.length >= 2) {
        	return {x:Number(strArr[0]), y:Number(strArr[1])};
        } else {
        	return {x:0, y:0};
        }
    }
});

module.exports = Vector2;