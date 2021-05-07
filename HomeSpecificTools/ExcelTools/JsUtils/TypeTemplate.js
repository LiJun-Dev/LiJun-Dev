/**
 * Created by zhangmingxu on 07/08/2017.
 */

var Class = require("./Class");
var TypeTemplate = Class.extend({
    Parse: function(str) {
        console.error("TypeTemplate.Parse NOT override.");
    },

    getFields: function() {
        console.error("TypeTemplate.getFields NOT override.");
    },

    getClassName: function() {
        console.warn("TypeTemplate.getClassName NOT override. use default: ");
        return undefined;
    },

    needExport: function() {
        return false;
    },

    _getField: function(idIndex, fieldName, type, desc) {
        return {
            idIndex: idIndex || 0,
            fieldName: fieldName,
            type: type,
            typeUpperCase: type.toUpperCase(),
            retType: type,
            desc: desc || "",
            isArray: false
        };
    }
});

module.exports = TypeTemplate;