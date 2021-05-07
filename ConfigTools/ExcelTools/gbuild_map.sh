#!/bin/sh

map_sheet_ids=([11]="1lLmbu0okMLmIojgCQ8-TevX2-hgY7rXzCkRUtm8qTZA"
[12]="1573sAzKUkEkfJKcKJWM9Qxc3_B3E5MvQBoP5cPx7CIY"
[13]="1b9YBVvTHXm6KWK8MoaxUUf4D2ZPI2CkRulGcqYI1N1E"
[14]="1R2Gq8Zn-iGdd-yZSN7H5saQPsZ_xa-DEhy6GRHdc3PQ"
[21]="13uysVYwRDHBbyFjBDRXqSId6r_nuxHWkHsUk0L_P7Xw"
[22]="1CNQn0CL9XA4v2IWMsZYtaMI1thKIXWrnRyR5yzSy5o0"
[23]="1Y9P2dZXb-1Y9PkX2IC33awdY9KarQFo7EDBIEJWVKos") 

if [ "$#" -lt "1" ] ; then
	echo "use all sheet!"
	sheets=${!map_sheet_ids[@]}
else
	sheets=($1)
fi

for key in ${sheets[@]}; do
    spreadsheet_id=${map_sheet_ids[$key]}
    echo "map sheet:" $spreadsheet_id

    # NOTE: OAuth2 used oauth2.json which was made by oauth.sh
    # modified oauth.sh to change CLIENT_ID etc.

    rootDir=`pwd`
    # echo ${rootDir}
    # echo $(pwd)/${0}

    #client script directory
    clientScriptDir="${rootDir}/tmp/TableManager"
    #client data directory
    clientDataDir="${rootDir}/tmp/tables/"
    #server script directory
    serverScriptDir="${rootDir}/tmp/src/"
    #server data directory
    serverDataDir="${rootDir}/tmp/table/"
    #output json directory
    jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/Map${key}Config/"
    #output json filename
    fileName="mapconfigs"

    #clean directory, some file may be already deleted
    node --inspect Tools.js ${clientScriptDir} --meta --mk
    node --inspect Tools.js ${clientDataDir} --meta --mk
    node --inspect Tools.js ${serverScriptDir} --rm --mk
    node --inspect Tools.js ${serverDataDir} --rm --mk
    node --inspect Tools.js ${jsonDataDir} --rm --mk

    node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b
    
done 
# pause