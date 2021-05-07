#!/bin/sh

export NODE_PATH=/usr/local/lib/node_modules

# NOTE: OAuth2 used oauth2.json which was made by oauth.sh
# modified oauth.sh to change CLIENT_ID etc.

curDir='pwd'

BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"
cd ${BASEDIR}

rootDir=`pwd`/../Hotel1/Assets/DragonSDK/DragonU3DSDK/.Tools

echo "rootDir: ${rootDir}"

#client script directory
unityScriptDir="${rootDir}/../../../Scripts/Hotel/Storage/AutoGeneration"
#clean directory, some file may be already deleted
/usr/local/bin/node --inspect ${rootDir}/Js/Tools.js ${unityScriptDir} --meta --mk

# hotel1
spreadsheet_id="157bnmSG5WLkAAcZcTQdgQ5v9lq5WOrAYTRfxsEywkJ8"
#unity script manager template name, such as TableManager[TableManager.template MUST in Template]
classTemplate="${rootDir}/Template/UnityStorage.template"
#Use OAuth2, defaults config is oauth2.json
/usr/local/bin/node --inspect ${rootDir}/Js/gDocBuilderTemplate.js ${spreadsheet_id} ${unityScriptDir} ${classTemplate}

#mv $unityScriptDir/StorageCommon.cs ${rootDir}/../Framework/Storage/

echo "Finished"
# pause
cd ${curDir}