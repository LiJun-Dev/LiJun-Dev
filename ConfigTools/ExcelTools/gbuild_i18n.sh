#!/bin/sh

spreadsheet_id="1lgCql3E6c2mTCpw6WZzw1OOedar9m7-RY6qTQN4hoc0"
rootDir=`pwd`

#client script directory
clientScriptDir="${rootDir}/tmp/TableManager"
#client data directory
clientDataDir="${rootDir}/tmp/tables/"
#server script directory
serverScriptDir="${rootDir}/tmp/src/"
#server data directory
serverDataDir="${rootDir}/tmp/table/"
#output json directory
jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/LocaleConfig/"


#clean directory, some file may be already deleted
node Tools.js ${clientScriptDir} --meta --mk
node Tools.js ${clientDataDir} --meta --mk
node Tools.js ${serverScriptDir} --rm --mk
node Tools.js ${serverDataDir} --rm --mk
node Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b -s

rsync -av --existing ${jsonDataDir} ${rootDir}/../../Hotel1/Assets/Resources/Export/Configs/LocaleConfig/
# pause
