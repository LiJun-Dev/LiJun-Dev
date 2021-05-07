var ArrayRewardProps = require("./../JsUtils/TypeTemplate").extend({

    Parse: function(str) {
        var rewards = [];
        var strArr = str.split(",");
        console.log(strArr);
        for(var i = 0; i < strArr.length; i++) {
            var rp = strArr[i].split(':');
            var id = parseInt(rp[0]);
            rp[1] = rp[1].slice(1, rp[1].length - 1);
            var range = rp[1].split('-');
            var item = {
                id:id,
                min:parseInt(range[0]),
                max:parseInt(range[1])
            }
            rewards.push(item);
        }
        return rewards;
    },

    getClassName: function() {
        return "List<RewardProps>";
    }
});

module.exports = ArrayRewardProps;