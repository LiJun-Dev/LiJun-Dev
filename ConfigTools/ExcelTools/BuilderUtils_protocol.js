//console.log("build excel data .. ");

var sys = require("sys");
var fs = require("fs");
var path = require('path');
var XLSX = require('xlsx');
var ncp = require('ncp').ncp;
var Handlebars = require('handlebars');

var exports = module.exports = {};

Handlebars.registerHelper("quotes", function(str) {
	return str.replace(/\"/gi, "\\\"");
});

Handlebars.registerHelper("for", function(from, to, incr, block) {
    var accum = "";
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

var klassList = [];
var klassListServer = [];

var csharpFillpath = "./CodeTable/CSharp/";

function Cleanup() {
	rmDir(csharpFillpath);
	console.log('临时目录清空完毕!');
}

exports.OutputConfig = function(clientScriptDir, clientDesScriptDir, clientDataDesDir) {
	this.clientScriptDir = clientScriptDir;
	this.clientDesScriptDir = clientDesScriptDir;
	this.clientDataDesDir = clientDataDesDir;
}

function Klass (filename, path) {
	this.typeName = filename.substring(0, filename.lastIndexOf("."));
	this.fklassName = upperFirstWord(this.typeName);
	this.filename = filename;
	this.dataFileName = this.typeName.toLowerCase();
	this.klassName = this.typeName;
	this.klassName = this.klassName.replace(/(?=\b)\w/g, function(e) {
		return e.toUpperCase();
	});;
	this.klassFilePath = path;
	//console.log(this);
}

//for google spreadsheet
exports.GssClass = function(classname, properties, valueTypes, descriptions, defaultValues, needReply, tprotocolType, tprotocolDescription) {
	this.typeName = classname;
	this.fklassName = upperFirstWord(this.typeName);
	this.filename = classname;
	this.dataFileName = this.typeName.toLowerCase();
	this.klassName = this.typeName;
	this.klassName = this.klassName.replace(/(?=\b)\w/g, function(e) {
		return e.toUpperCase();
	});;
	this.properties = properties;
	this.valueTypes = valueTypes;
	this.descriptions = descriptions;
	this.defaultvalues = defaultValues;
	this.protocolType = tprotocolType;
	this.needReply = needReply;
	this.protocolDescription = tprotocolDescription;
	
	//console.log(this);
}

exports.buildSpreadsheet = function(sheetName, gssClassList, outputConfig) {
	Cleanup();
	mkDir(csharpFillpath);

	console.log( "buildSpreadsheet: " + sheetName + "\n");
	//build
	gssClassList.forEach (function(gssClass) {
		buildGssClass(gssClass, sheetName)
	});

	if(sheetName == "C2S")
	{
		var content = Handlebars.compile(fs.readFileSync("./csharpC2SBaseProtocol.template", "utf-8"));
		fs.writeFileSync(csharpFillpath + "C2SBaseProtocol.cs", content({
			klassList: gssClassList
		}), "utf-8");
	}
	else if(sheetName == "S2C")
	{
		var content = Handlebars.compile(fs.readFileSync("./csharpS2CBaseProtocol.template", "utf-8"));
		fs.writeFileSync(csharpFillpath + "S2CBaseProtocol.cs", content({
			klassList: gssClassList
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
	mkDir(outputConfig.clientScriptDir);
		
	ncp(csharpFillpath, outputConfig.clientScriptDir, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log('复制C#文件至目标路径!');
	});

	if(sheetName == "DataStruct")
	{
		//copy
		mkDir(outputConfig.clientDataDesDir);
			
		ncp(csharpFillpath, outputConfig.clientDataDesDir, function(err) {
			if (err) {
				return console.error(err);
			}
			console.log('复制C#文件至Unity目标路径!');
		});
	}
	else
	{
		//copy
		mkDir(outputConfig.clientDesScriptDir);
			
		ncp(csharpFillpath, outputConfig.clientDesScriptDir, function(err) {
			if (err) {
				return console.error(err);
			}
			console.log('复制C#文件至Unity目标路径!');
		});
	}


	//Cleanup();
}


function Field() {
	this.fieldname = "";
	this.fieldnameUpder = "";
	this.fieldnameUpderFirstWord = "";

	this.idIndex = 0; //field顺序

	this.type = "";
	this.isINT = false;
	this.isLong = false;
	this.isFloat = false;
	this.isString = false;
	this.isBool = false;
	this.isJObject = false;
	this.isJsonObject = false;
	this.retType = "int";
	this.isConst = false;

	this.defaultvalue = "";
	this.hasDefaultvalue = false;
	this.desc = "";
	this.isArray = false;
	this.arrayDepth = 0;
	this.arrayDepthM2 = false;
	this.arrayDepthM3 = false;

	this.setFieldname = function(name) {
		this.fieldname = name;
		this.fieldnameUpder = this.fieldname.toUpperCase();
		this.fieldnameUpderFirstWord = upperFirstWord(this.fieldname);
	}

	this.setType = function(t) {
		this.type = t;
		if (t == "INT") {
			this.retType = "int";
			this.isINT = true;
		}
		else if( t == "LONG")
		{
			this.retType = "long";
			this.isLong = true;
		} 
		else if( t == "FLOAT")
		{
			this.retType = "float";
			this.isFloat = true;
		} 
		else if( t == "STRING")
		{
			this.retType = "string";
			this.isString = true;
		} 
		else if( t == "CONST STRING")
		{
			this.retType = "const string";
			this.isString = true;
			this.isConst = true;
		} 
		else if( t == "BOOL")
		{
			this.retType = "bool";
			this.isBool = true;
		} 
		else if( t == "JsonObject")
		{
			this.retType = "JsonObject";
			this.isJsonObject = true;
		}
		else 
		{			
			var sstring = t;
			var complexType = sstring.split(",");
			if(complexType[0] == "ARRAY")
			{
				this.setType(complexType[complexType.length - 1]);
				this.arrayDepth = complexType.length - 1;
				if(this.arrayDepth == 2)
				{
					this.arrayDepthM2 = true;
				}
				else if(this.arrayDepth == 3)
				{
					this.arrayDepthM3 = true;
				}
				
				this.isArray = true;
			}
			else
			{
				this.isJObject = true;
				this.retType = t;
			}
		}
	}
}
var buildError = [];

function addError(table, msg) {
	console.log(msg);
	buildError[buildError.length] = table + " -> " + msg
}


function buildGssClass (gssClass, sheetName) {
	//console.log(gssClass.contentList);
	console.log("export google spreadsheet: " , gssClass.filename);

	function empty(v) {
		switch (typeof v) {
			case 'undefined':
				return true;
			case 'string':
				var val = v.replace(/(^\s*)|(\s*$)/g, "");
				if (val.length == 0) return true;
				break;
			case 'boolean':
				if (!v) return true;
				break;
			case 'number':
				return false;
			case 'object':
				if (null === v) return true;
				if (undefined !== v.length && v.length == 0) return true;
				for (var k in v) {
					return false;
				}
				return true;
				break;
		}
		return false;
	}

	var classType;

	var fieldArray = [];

	for(key in gssClass.properties) 
	{
		var idxCol = key - 1;
		if (! fieldArray[idxCol]) 
		{
			fieldArray[idxCol] = new Field();
			fieldArray[idxCol].idIndex = idxCol;
			fieldArray[idxCol].setFieldname(gssClass.properties[key]);
			fieldArray[idxCol].setType(gssClass.valueTypes[key]);
			fieldArray[idxCol].desc = gssClass.descriptions[key];
			fieldArray[idxCol].hasDefaultvalue = !empty(gssClass.defaultvalues[key]);
			fieldArray[idxCol].defaultvalue = gssClass.defaultvalues[key];
		}
	}
	var contentCSharp;

	if(sheetName == "C2S")
	{
		contentCSharp = Handlebars.compile(fs.readFileSync("./CSharpCode_c2sprotocol.template", "utf-8"));
	}
	else if(sheetName == "S2C")
	{
		contentCSharp = Handlebars.compile(fs.readFileSync("./CSharpCode_s2cprotocol.template", "utf-8"));
	}
	else if(sheetName == "DataStruct")
	{
		contentCSharp = Handlebars.compile(fs.readFileSync("./CSharpCode_protocol_data.template", "utf-8"));
	}

	//class file
	//fieldArray.splice(1, 1);
	var codefileCSharp = csharpFillpath + sheetName + "_" + gssClass.fklassName + ".cs";
	fs.writeFileSync(codefileCSharp, contentCSharp({
		klassName: gssClass.fklassName,
		fieldArray: fieldArray,
		pType: gssClass.protocolType,
		pDes: gssClass.protocolDescription,
		pNeedReply: gssClass.needReply
	}), "utf-8");
}

function to10Radix(data) {
	var ret = 0;
	for (var i = 0; i < data.length; i++) {
		ret += i * 26 + data[i].charCodeAt() - 'A'.charCodeAt();
	}
	return ret;
}

function upperFirstWord(val) {
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

function startsWith(str, prefix) {
	return str.indexOf(prefix) === 0;
}

/**
 * 去掉末尾的数字和下划线
 */
function carveEndNum(str) {
	var index = str.length;
	for (var i = str.length - 1; i >= 0; i--) {
		if (isNumber(str.charAt(i))) { // || str.charAt(i) == '_'
			index--;
		}
	}
	return str.substring(0, index);
}

function carveStarStr(str) {
	var index = 0;
	for (var i = 0; i < str.length; i++) {
		if (!isNumber(str.charAt(i))) {
			index++;
		}
	}
	return str.substring(index);
}


rmDir = function(dirPath) {
	try {
		if(! fs.existsSync(dirPath)) {
			return;
		}
		var files = fs.readdirSync(dirPath);
	} catch (e) {
		console.error(e);
		return;
	}
	if (files.length > 0)
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile())
				fs.unlinkSync(filePath);
			else
				rmDir(filePath);
		}
};

//make directory recursive
mkDir = function(dirPath) {
	//console.log("mkDir is called, path : ", dirPath);
	try {
		if(fs.existsSync(dirPath)) {
			return;
		}
		mkDir(path.dirname(dirPath));
		fs.mkdirSync(dirPath);
	} catch(e) {
		console.error(e);
		return;
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////

rmDir("./Public/");
rmDir("./CodeTable/CSharp/");
rmDir("./CodeTable/Java/");
