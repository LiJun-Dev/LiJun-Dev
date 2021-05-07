var ArrayArrayInt = require("./../JsUtils/TypeTemplate").extend({
    Parse: function(str) {
        var ret = [];
        var strArr = str.split(",");
        for(var i = 0; i < strArr.length; i++) {
            if(strArr[i] && strArr[i].length > 0) {
                var items = strArr[i].split("-");
                var item = [];
                for(var j = 0; j < items.length; j++) {
                    if(items[j] && items[j].length > 0) {
                        item.push(parseInt(items[j]));
                    }
                }
                if(item.length > 0) {
                    ret.push(item);
                }
            }
        }
        console.log("ArrayArrayInt: ", ret);
        return ret;
    },

    getClassName: function() {
        return "List\<List\<int\>\>";
    }
});

module.exports = ArrayArrayInt;