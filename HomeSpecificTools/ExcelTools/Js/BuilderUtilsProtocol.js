//console.log("build excel data .. ");

var fs = require("fs");
var path = require('path');
var ncp = require('ncp').ncp;
var Handlebars = require('handlebars');
var Tools = require("./Tools");
var exports = module.exports = {};

Handlebars.registerHelper("quotes", function(str) {
	return str.replace(/\"/gi, "\\\"");
});

var unityScriptDir = "./CodeTable/Unity/";
exports.Cleanup = function() {
	Tools.rmDir(unityScriptDir);
	Tools.mkDir(unityScriptDir);
	console.log('临时目录清空完毕!');
}

exports.OutputConfig = function(unityScriptDir) {
	this.unityScriptDir = unityScriptDir;
}


///////////////////////////////////// Google Sheets /////////////////////////////////////
//for google spreadsheet
exports.GssClass = function(filename, classParam, protocol, protocolDescription, properties, valueTypes, descriptions, defaultValues) {
	this.typeName = filename;
	this.className = upperFirstWord(this.typeName);
	this.filename = filename;
	this.properties = properties;
	this.valueTypes = valueTypes;
	this.descriptions = descriptions;
	this.defaultValues = defaultValues;
	this.classParam = upperFirstWord(classParam);
	this.protocol = protocol;
	this.protocolDescription = protocolDescription;
}

exports.buildSpreadsheet = function(sheetName, gssClassList, outputConfig) {
	//build
	gssClassList.forEach (function(gssClass) {
		buildGssClass(gssClass, sheetName, outputConfig);
	});

	if(sheetName == "S2C") {
		var content = Handlebars.compile(fs.readFileSync("./Template/Protocol/S2CBase.template", "utf-8"));
		fs.writeFileSync(unityScriptDir + "S2CProtocolRuntimeLoader.cs", content({
			classList: gssClassList
		}), "utf-8");
	}

	//check error
	if (buildError.length > 0) {
		console.log("发现" + buildError.length + "个错误: \n");
		for (var i = 0; i < buildError.length; i++) {
			console.log(buildError[i]);
		};
	} else {
		console.log("解析完成");
	}
		
	//copy
	mkDir(outputConfig.unityScriptDir);
	ncp(unityScriptDir, outputConfig.unityScriptDir, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log('复制Unity Script文件至目标路径!');
	});
}

function Field() {
	this.fieldName = "";
	this.idIndex = 0; //field顺序

	this.type = "";
	this.typeUpperCase = "";
	this.retType = "int";
	this.desc = "";

	this.defaultValue = undefined;
	this.defaultIsNew = false;
	this.hasDefaultValue = false;

	this.setDefaultValue = function(defaultValue) {
		this.defaultValue = defaultValue;
		if(defaultValue == "new"){
			this.defaultIsNew = true;
		}
		if(defaultValue == undefined || defaultValue == "") {
			this.hasDefaultValue = false;
		} else {
			this.hasDefaultValue = true;
		}
	}

	this.setFieldName = function(name) {
		this.fieldName = name;
	}

	this.setType = function(t) {
		this.type = t;
		this.typeUpperCase = this.type.toUpperCase();
		if (this.typeUpperCase == "INT" || this.typeUpperCase == "NUMBER") {
			this.retType = "int";
		} else if(this.typeUpperCase == "FLOAT") {
			this.retType = "float";
		} else if(this.typeUpperCase == "DOUBLE") {
			this.retType = "double";
		} else if(this.typeUpperCase == "STRING" || this.typeUpperCase == "ENUM") {
			this.retType = "string";
		} else if (this.typeUpperCase == "ARRAYNUMBER" || this.typeUpperCase == "ARRAYINT") {
			this.retType = "List<int>";
		} else if(this.typeUpperCase == "ARRAYFLOAT") {
			this.retType = "List<float>";
		} else if(this.typeUpperCase == "ARRAYDOUBLE") {
			this.retType = "List<double>";
		} else if(this.typeUpperCase == "ARRAYSTRING") {
			this.retType = "List<string>";
		} else {
			//this.retType = "object";
			this.retType = t;
		}
	}
}
var buildError = [];

function addError(table, msg) {
	console.log(msg);
	buildError[buildError.length] = table + " -> " + msg
}

function buildGssClass (gssClass, sheetName, outputConfig) {
	//console.log(gssClass.contentList);
	console.log("export google spreadsheet: " , gssClass.filename);
	var fieldArray = [];
	for(var key in gssClass.properties) {
		var property = gssClass.properties[key];
		var idxCol = key - 1;
		if (! fieldArray[idxCol]) {
			fieldArray[idxCol] = new Field();
			fieldArray[idxCol].idIndex = idxCol;
			fieldArray[idxCol].setFieldName(property);
			fieldArray[idxCol].setType(gssClass.valueTypes[property]);
			fieldArray[idxCol].desc = gssClass.descriptions[property];
			fieldArray[idxCol].setDefaultValue(gssClass.defaultValues[property]);
		}
	}

	var contentUnity;
	var fileName;
	if(sheetName == "C2S") {
		fileName = sheetName + gssClass.className + ".cs";
		gssClass.classParam = gssClass.classParam || "GET";
		gssClass.classParam = gssClass.classParam.toUpperCase();
		if(gssClass.classParam == "GET") {
			gssClass.classParam = "HttpType.GET";
		} else {
			gssClass.classParam = "HttpType.POST";
		}

		contentUnity = Handlebars.compile(fs.readFileSync("./Template/Protocol/C2S.template", "utf-8"));
	} else if(sheetName == "S2C") {
		fileName = sheetName + gssClass.className + ".cs";
		contentUnity = Handlebars.compile(fs.readFileSync("./Template/Protocol/S2C.template", "utf-8"));
	} else if(sheetName == "DataClass") {
		fileName = gssClass.className + ".cs";
		contentUnity = Handlebars.compile(fs.readFileSync("./Template/Protocol/DataClass.template", "utf-8"));
	}
	//class file
	var codeFile = unityScriptDir + fileName;
	var code = contentUnity({
		className: gssClass.className,
		hasClassParam: (gssClass.classParam != undefined && gssClass.classParam != ""),
		defineData: gssClass.classParam=="NODATA",
		classParam: gssClass.classParam,
		protocol: gssClass.protocol,
		protocolDescription: gssClass.protocolDescription,
		fieldArray: fieldArray
	});
	fs.writeFileSync(codeFile, code, "utf-8");
	//console.log("gss: ", fieldArray);
}

function to10Radix(data) {
	var ret = 0;
	for (var i = 0; i < data.length; i++) {
		ret += i * 26 + data[i].charCodeAt() - 'A'.charCodeAt();
	}
	return ret;
}

function upperFirstWord(val) {
	if(val == undefined || val == null || val == "") {
		return val;
	}
	// val = val.toLowerCase();
	var ret = "";
	var upper = true;
	for (var i = 0; i < val.length; i++) {
		var c = val[i];
		if (upper) {
			upper = false;
			ret += c.toUpperCase();
		} else {
			if (c == '_') {
				upper = true;
			} else {
				ret += c;
			}
		}
	}
	return ret;
}

/**数值判断。允许数值面前增加+ -号，允许存在一个小数点。输入非法字符返回0
 * 使用：isNumber(this)
 */
function isNumber(str) {
	if(str == undefined) {
		return false;
	}

	var oneDecimal = false;
	var oneChar = 0;
	for (var i = 0; i < str.length; i++) {
		oneChar = str.charAt(i).charCodeAt(0);

		if (oneChar == 45) {
			if (i == 0) {
				continue;
			} else {
				return false;
			}
		}
		// 小数点 
		if (oneChar == 46) {
			if (!oneDecimal) {
				oneDecimal = true;
				continue;
			} else {
				return false;
			}
		}
		// 数字只能在0和9之间 
		if (oneChar < 48 || oneChar > 57) {
			return false;
		}
	}
	return true;
}

exports.joinDir = joinDir = function(dirPath, filename) {
	return path.join(dirPath, filename);
}