#!/bin/sh

export NODE_PATH=/usr/local/lib/node_modules


# NOTE: OAuth2 used oauth2.json which was made by oauth.sh
# modified oauth.sh to change CLIENT_ID etc.

curDir=`pwd`

BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"
cd ${BASEDIR}

rootDir=`pwd`

#client script directory
unityScriptDir="${rootDir}/../../../Scripts/Common/Storage/AutoGeneration"
#clean directory, some file may be already deleted
/usr/local/bin/node --inspect Js/Tools.js ${unityScriptDir} --meta --mk

# ck3
spreadsheet_id="1YiH3gT8U4J28pK-yvgjm6GE67B1NzJyD99BpmW0gPSw"
#unity script manager template name, such as TableManager[TableManager.template MUST in Template]
classTemplate="./Template/UnityStorage.template"
#Use OAuth2, defaults config is oauth2.json
/usr/local/bin/node --inspect Js/gDocBuilderTemplate.js ${spreadsheet_id} ${unityScriptDir} ${classTemplate}

# storage common
/usr/local/bin/node Js/gDocBuilderTemplate.js 1uxeP2VVZ5l4f4j8yrS7jeAdY9QjSLspvU0Jx5UYht38 ${unityScriptDir} ${classTemplate}
mv $unityScriptDir/StorageCommon.cs ../Framework/Storage/
mv $unityScriptDir/StorageMarketing.cs ../Framework/Storage/

echo "Finished"
# pause
cd ${curDir}
