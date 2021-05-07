var http = require('http');  
var fs = require('fs');
var path = require('path');
  
var qs = require('querystring');  

  
var config = requireConfg();

var options = {  
    hostname: config.config['host'],  
    port: config.config['port'],  
    path: config.config['loadTablepath'] + '?' ,  
    method: config.config['loadTableMethod'] 
};  

var getTable = function(param, callback) {
    if (!param.spreadsheetId) {
        console.log("spreadSheetId can't be null or empty");
        return;
    }
    options.path = options.path + qs.stringify(param);

    let req = http.request(options, function (res) {  
        res.setEncoding('utf8');  
        let result = '';
        res.on('data', function (chunk) {  
            result += chunk;
        }); 
        res.on('end', function() {
            callback(result);
        })
        
    });  

    req.end();
}




function requireConfg(){
    //console.log("requireCustomerJs")
    var customerJsArr = {};
    var files = fs.readdirSync("./config");
    for(var index in files){
        //console.log(files[index])
        var name = path.basename(files[index],".js");
        var md = require("./"+path.join("./Config",name));
        customerJsArr[name] = md;
        customerJsArr[name.toLowerCase()] = md;
    }
    return customerJsArr;
}

module.exports = getTable;