var SlotSpriteData = require("./../JsUtils/TypeTemplate").extend({
    Parse: function(str) {
        var strArr = str.split(":");
        return {slot:strArr[0] ,sprite:strArr[1]};
    },

    needExport: function() {
        return true;
    },

    getFields: function() {
        var fields = [];
        fields.push(this._getField(0, "slot", "string"));
        fields.push(this._getField(1, "sprite", "string"));
        return fields;
    }
});

module.exports = SlotSpriteData;