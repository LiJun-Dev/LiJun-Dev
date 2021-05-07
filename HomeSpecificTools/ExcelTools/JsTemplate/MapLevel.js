var MapLevel = require("./../JsUtils/TypeTemplate").extend({

    Parse: function(str) {
        var strArr = str.split(":");
        var str = {};
        if(strArr.length > 0)
        {
            str = {mapId:parseInt(strArr[0]),levelId:parseInt(strArr[1])};
        }
        else
        {
            str = {mapId:0,levelId:0};
        }
        return str;
    },

    getClassName: function() {
        return "MapLevel";
    }

});

module.exports = MapLevel;