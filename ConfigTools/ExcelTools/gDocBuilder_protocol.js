#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var Builder = require('./BuilderUtils_protocol.js');
var OAuth2Config = require('./oauth2.json');
var google = require('googleapis');

program
    .version('0.0.1')
    .usage('<spreadsheet-id> <client-script-dir> [options]')
    .option('-u, --user [user]', 'Google account to login')
    .option('-p, --password [password]', 'Password to login')
    .option('-t, --token [token]', 'Auth token acquired externally')
    .option('-y, --tokentype [tokentype]', 'Type of the informed token (defaults to Bearer)')
    .option('-c, --hash [column]', 'Column to hash the final JSON')
    .option('-o, --oauth2 [oauth2]', 'Use OAuth2, defaults config is oauth2.json')
    .option('-l, --list-only', 'Ignore headers and just list the values in arrays')
    .parse(process.argv);

if (program.args.length < 4) {
    program.help();
}

var spreadsheetId = program.args[0];
var outputConfig = new Builder.OutputConfig(program.args[1], program.args[2], program.args[3]);

//queue to build
var gssClassList = [];
var running = false;

if (program.token) {
    var tokentype = program.tokentype || "Bearer";
    spreadsheet.setAuthToken({
        value: program.token,
        type: tokentype
    });
    run();
} else if (program.oauth2) {
    var GoogleSpreadsheet = require("google-spreadsheets");
    var oauth2Client = new google.auth.OAuth2(OAuth2Config.CLIENT_ID, OAuth2Config.CLIENT_SECRET, OAuth2Config.REDIRECT_URL);
    /*
    oauth2Client.setCredentials({
        access_token: OAuth2Config.access_token,
        refresh_token: OAuth2Config.refresh_token
    });
*/

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
            // done(null, {
            //     type: 'Bearer',
            //     token: token
            // });
            //console.log('1: ', token);

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
    //console.log(OAuth2Config);
   
} else if (program.user && program.password) {
    var GoogleSpreadsheet = require("google-spreadsheet");
    var spreadsheet = new GoogleSpreadsheet(spreadsheetId);
    spreadsheet.setAuth(program.user, program.password, function(err) {
        if (err) {
            throw err;
        }
        run(spreadsheet);
    });
} else {
    var spreadsheet;
    run(spreadsheet);
}

//NOTE: use spreadsheet
function runOAuth2(spreadsheet) {
    if(running) {
        console.log('already running...');
        return;
    }
    running = true;

    var countSheet = spreadsheet.worksheets.length;
    console.log('google spreadsheet: the worksheet has ', countSheet, ' sheets. begin reading...');
    readsheetOAuth2(spreadsheet.worksheets, 0);
}


function readsheetOAuth2(worksheets, worksheetsIndex) {
        
        //console.log('sheet: ', worksheets[idxSheet]);

        var sheetName = worksheets[worksheetsIndex].title;
        console.log('google spreadsheet: read the ', worksheetsIndex, ' ', 'sheet: ', sheetName);
        
        worksheets[worksheetsIndex].cells(null, function(err, cells) 
        {
            if (err) {
                throw err;
            }
            
            //console.log('cells: ', cells['cells'].keys);

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

            var isHashed = program.hash && !program.listOnly;
            var finalList = isHashed ? {} : [];

            
            for (var i = 0; i < rows.length ; i+=5) 
            {
                var classname = "ERROR";
                var properties = rows[i].reduce(function(properties, cell) {
                    if (cell.value === "")
                        return properties;

                    if(cell[colProp] == 1)
                    {
                        classname = cell.value
                            .replace(/[- ]/ig, " ")
                            .split(" ")
                            .map(function(val, index) {
                                return !index ? val : val.charAt(0).toUpperCase() + val.slice(1);
                            })
                            .join("");
                    }
                    else
                    {
                        properties[cell[colProp] - 1] = cell.value
                            .replace(/[- ]/ig, " ")
                            .split(" ")
                            .map(function(val, index) {
                                return !index ? val : val.charAt(0).toUpperCase() + val.slice(1);
                            })
                            .join("");
                    }
                    
                    return properties;
                }, {});

                var needReply = true;
                var valueTypes = rows[i+1].reduce(function(valueTypes, cell) {
                    if (cell.value === "")
                        return valueTypes;
                    if( cell[colProp] == 1 )
                    {
                        if(cell.value.toLowerCase() == "false")
                        {
                            needReply = false;
                        }
                        return valueTypes;
                    }

                    valueTypes[cell[colProp]-1] = cell.value;

                    return valueTypes;
                }, {});

                var protocolType = "0";
                var defaultValuse = rows[i+2].reduce(function(defaultValuse, cell) {
                    if (cell.value === "")
                        return defaultValuse;
                    if( cell[colProp] == 1 )
                    {
                        protocolType = cell.value;
                    }
                    else
                    {
                        defaultValuse[cell[colProp] - 1] = cell.value;
                    }
                    
                    return defaultValuse;
                }, {});

                var protocolDescription = "NULL";
                var descriptions = rows[i+3].reduce(function(descriptions, cell) {
                    if ( cell.value === "" )
                        return descriptions;

                    if( cell[colProp] == 1 )
                    {
                        protocolDescription = cell.value;
                    }
                    else
                    {
                        descriptions[cell[colProp] - 1] = cell.value.toUpperCase();
                    }

                    return descriptions;
                }, {});

                console.log("classname: " + classname + " ,protocolType :" + protocolType + " ,protocolDescription:" + protocolDescription);
                var gssClass = new Builder.GssClass(classname, properties, valueTypes, descriptions, defaultValuse, needReply, protocolType, protocolDescription);
                gssClassList[gssClassList.length] = gssClass;
            };
            
            Builder.buildSpreadsheet(sheetName, gssClassList, outputConfig);
            gssClassList = [];

            worksheetsIndex++;
            if( worksheetsIndex < worksheets.length )
            {
                readsheetOAuth2(worksheets, worksheetsIndex)
            }
            else
            {
                running = false;
                console.log('google spreadsheet finished!');
            }
        });        
}