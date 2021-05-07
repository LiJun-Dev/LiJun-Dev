var ArrayFoodIcon = require("./../JsUtils/TypeTemplate").extend({

    Parse: function(str) {
        str = str.trim();
        var foodIcons = [];
        var strArr = str.split(",");
        console.log(strArr);
        for(var i = 0; i < strArr.length; i++) {
            var rp = strArr[i].split(':');
            var str = {};
            if(rp.length > 1)
            {
                str = {icon:rp[0],partId:parseInt(rp[1])};
            }
            else
            {
                str = {icon:rp[0],partId:-1};
            }
            
            foodIcons.push(str);
        }
        return foodIcons;
    },

    getClassName: function() {
        return "List<FoodIcon>";
    }

});

module.exports = ArrayFoodIcon;