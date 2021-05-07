#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var program = require('commander');
var Builder = require('./BuilderUtilsTemplate2');
var OAuth2Config = require('../oauth2.json');
var google = require('googleapis');

program
    .version('0.0.1')
    .usage('<spreadsheet-id> <unity-script-dir> <unity-script-template> [options]')
    .parse(process.argv);

if (program.args.length < 3) {
    program.help();
}

var spreadsheetId = program.args[0];
var outputConfig = new Builder.OutputConfig(program.args[1], program.args[2], program.args[3], program.args[4], program.args[5]);


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
        for (key in datas) {
            var rowIndex = key - 1;
            if (typeof rows[rowIndex] === "undefined") {
                rows[rowIndex] = [];
            }
            var rowdata = datas[key];
            for (cKey in rowdata) {
                rows[rowIndex].push(rowdata[cKey]);
            };
        };

        rows.forEach(function(col) {
            col.sort(function(cell1, cell2) {
                return cell1[colProp] - cell2[colProp];
            });
        });

        var finalList = [];
        var properties = rows[0].reduce(function(properties, cell) {
            if (cell.value === "") {
                return properties;
            }

            properties[cell[colProp]] = cell.value
                //.toLowerCase()
                .replace(/[- ]/ig, " ")
                .split(" ")
                .map(function(val, index) {
                    return !index ? val : val.charAt(0).toUpperCase() + val.slice(1);
                })
                .join("");

            return properties;
        }, {});

        var valueTypes = rows[1].reduce(function(valueTypes, cell) {
            if (cell.value === "") {
                return valueTypes;
            }
            var property = properties[cell[colProp]];
            valueTypes[property] = cell.value;
            return valueTypes;
        }, {});
        console.log(valueTypes);

        var descriptions = rows[2].reduce(function(descriptions, cell) {
            if (cell.value === "") {
                return descriptions;
            }

            var property = properties[cell[colProp]];
            descriptions[property] = cell.value.toUpperCase();

            return descriptions;
        }, {});
        console.log(descriptions);


        //console.log(sheetName);
        var gssClass = new Builder.GssClass(sheetName, properties, valueTypes, descriptions, program.args[3]);
        gssClassList[gssClassList.length] = gssClass;
        if(idxSheet < countSheet - 1) {
            readsheetOAuth2(worksheets, idxSheet + 1, countSheet);
        } else {
            Builder.buildSpreadsheet(gssClassList, outputConfig);
            running = false;
            console.log('google spreadsheet finished!');
            console.log( 'gssClassList' + gssClassList);
        }

    });
}