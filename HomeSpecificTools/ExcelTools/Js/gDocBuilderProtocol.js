#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var program = require('commander');
var Builder = require('./BuilderUtilsProtocol');
var OAuth2Config = require('../oauth2.json');
var google = require('googleapis');

program
    .version('0.0.1')
    .usage('<spreadsheet-id> <unity-script-dir> [options]')
    .option('-v, --vertical [vertical]', 'vertical excel')
    .parse(process.argv);

if (program.args.length < 2) {
    program.help();
}

var spreadsheetId = program.args[0];
var outputConfig = new Builder.OutputConfig(program.args[1]);

//queue to build
var gssClassList = [];
var running = false;

//use oauth2 mode
var GoogleSpreadsheet = require("google-spreadsheets");
var oauth2Client = new google.auth.OAuth2(OAuth2Config.CLIENT_ID, OAuth2Config.CLIENT_SECRET, OAuth2Config.REDIRECT_URL);

oauth2Client.setCredentials({
    access_token: 'DUMMY',
    expiry_date: 1,
    refresh_token: OAuth2Config.refresh_token,
    token_type: 'Bearer'
});

oauth2Client.getAccessToken(function(err, token) {
    if (err) {
        //done('Google OAuth2 Error: ' + err);
        throw err;
    } else {

        spreadsheet = GoogleSpreadsheet({
            key: spreadsheetId,
            auth: oauth2Client
        }, function(err, spreadsheet) {
            if (err) {
                throw err;
            }
            //console.log('Begin: ', spreadsheet);
            runOAuth2(spreadsheet);
        });
        console.log('End...');
    }
});

//NOTE: use spreadsheet
function runOAuth2(spreadsheet) {
    if(running) {
        console.log('already running...');
        return;
    }
    running = true;

    Builder.Cleanup();

    var countSheet = spreadsheet.worksheets.length;
    console.log('google spreadsheet: the worksheet has ', countSheet, ' sheets. begin reading...');
    readsheetOAuth2(spreadsheet.worksheets, 0, countSheet);
}

//NOTE: use spreadsheet NOT spreadsheets
function readsheetOAuth2(worksheets, idxSheet, countSheet) {
    var sheetName = worksheets[idxSheet].title;

    console.log('google spreadsheet: read the ', idxSheet, ' ', 'sheet: ', sheetName);

    var jsTemplateMap = {};

    //console.log(jsTemplate);
    worksheets[idxSheet].cells(null, function(err, cells) {
        if (err) {
            throw err;
        }

        //program.vertical = true;
        var rowProp = program.vertical ? "col" : "row";
        var colProp = program.vertical ? "row" : "col";

        var rows = [];
        var datas = cells['cells'];
        for (var key in datas) {
            var rowIndex = key - 1;
            if (typeof rows[rowIndex] === "undefined") {
                rows[rowIndex] = [];
            }
            var rowdata = datas[key];
            for (var cKey in rowdata) {
                rows[rowIndex].push(rowdata[cKey]);
            }
        }

        rows.forEach(function(col) {
            col.sort(function(cell1, cell2) {
                return cell1[colProp] - cell2[colProp];
            });
        });

        for (var i = 0; i < rows.length ; i+=5)
        {
            var className = "ERROR";
            var properties = rows[i].reduce(function(properties, cell) {
                if (cell.value === "") {
                    return properties;
                }

                if(cell[colProp] == 1) {
                    className = formatName(cell.value);
                }
                else {
                    properties[cell[colProp]] = formatName(cell.value);
                }

                return properties;
            }, {});

            var classParam = undefined;
            var valueTypes = rows[i+1].reduce(function(valueTypes, cell) {
                if (cell.value === "") {
                    return valueTypes;
                }
                if( cell[colProp] == 1 ) {
                    if(cell.value != undefined && cell.value != "") {
                        classParam = cell.value;
                    }
                } else {
                    var property = properties[cell[colProp]];
                    valueTypes[property] = cell.value;
                }

                return valueTypes;
            }, {});

            var protocol = "";
            var defaultValues = rows[i+2].reduce(function(defaultValues, cell) {
                if (cell.value === "") {
                    return defaultValues;
                }
                if( cell[colProp] == 1 ) {
                    protocol = cell.value;
                } else {
                    var property = properties[cell[colProp]];
                    defaultValues[property] = cell.value;
                }

                return defaultValues;
            }, {});

            var protocolDescription = "";
            var descriptions = rows[i+3].reduce(function(descriptions, cell) {
                if ( cell.value === "" ) {
                    return descriptions;
                }

                if( cell[colProp] == 1 ) {
                    protocolDescription = cell.value;
                } else {
                    var property = properties[cell[colProp]];
                    descriptions[property] = cell.value.toUpperCase();
                }

                return descriptions;
            }, {});

            console.log("className: " + className + " ,protocolType :" + protocol + " ,protocolDescription:" + protocolDescription);
            var gssClass = new Builder.GssClass(className, classParam, protocol, protocolDescription, properties, valueTypes, descriptions, defaultValues);
            gssClassList[gssClassList.length] = gssClass;
        }

        Builder.buildSpreadsheet(sheetName, gssClassList, outputConfig);
        gssClassList = [];

        if(idxSheet < countSheet - 1) {
            readsheetOAuth2(worksheets, idxSheet + 1, countSheet);
        } else {
            running = false;
            console.log('google spreadsheet finished!');
        }

    });
}

function formatName(name) {
    return name.replace(/[- ]/ig, " ")
        .split(" ")
        .map(function(val, index) {
            return !index ? val : val.charAt(0).toUpperCase() + val.slice(1);
        })
        .join("");
}