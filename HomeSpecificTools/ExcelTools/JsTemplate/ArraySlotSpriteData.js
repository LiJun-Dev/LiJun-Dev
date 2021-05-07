var ArraySlotSpriteData = require("./../JsUtils/TypeTemplate").extend({

    Parse: function(str) {
        var ssdList = [];
        var strArr = str.split(",");
        for(var i = 0; i < strArr.length; i++) {
            var ssd = strArr[i].split(':');
            ssdList.push({slot:ssd[0] ,sprite:ssd[1]});
        }
        return ssdList;
    },

    getClassName: function() {
        return "List<SlotSpriteData>";
    }

});

module.exports = ArraySlotSpriteData;