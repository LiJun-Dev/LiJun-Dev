#!/bin/sh

export NODE_PATH=/usr/local/lib/node_modules

# NOTE: OAuth2 used oauth2.json which was made by oauth.sh
# modified oauth.sh to change CLIENT_ID etc.

curDir='pwd'

BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"
cd ${BASEDIR}

rootDir=`pwd`/.Tools

echo "rootDir: ${rootDir}"

#client script directory
unityScriptDir="${rootDir}/../../Hotel1/Assets/Scripts/Activity/Valentine/Config"
#clean directory, some file may be already deleted
/usr/local/bin/node --inspect ${rootDir}/Js/Tools.js ${unityScriptDir} --meta --mk

# Hotel1-EventValentine
spreadsheet_id="1DzlcbK2dTF5Tok5ApeASU1CeiEWwzKERs6boKz2z68s"
#unity script manager template name, such as TableManager[TableManager.template MUST in Template]
classTemplate="${rootDir}/Template/CSharpConfig.template"
managerClassTemplate="${rootDir}/Template/CSharpConfigManager.template"
nameSpace="Valentine"
jsonPath="Configs/Events/Valentine/eventvalentine"
#Use OAuth2, defaults config is oauth2.json
/usr/local/bin/node --inspect ${rootDir}/Js/gDocBuilderTemplate2.js ${spreadsheet_id} ${unityScriptDir} ${classTemplate} ${nameSpace} ${managerClassTemplate} ${jsonPath}

# pause
echo "Finished"