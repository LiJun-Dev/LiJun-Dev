#!/bin/sh
spreadsheet_id="10nApelL_emo6OMxWLILOVGTeX5fqUZO_hHks7iWs2Fs"
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
jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/CommonConfig/"
#output json filename
fileName="game"

#clean directory, some file may be already deleted
node Tools.js ${clientScriptDir} --meta --mk
node Tools.js ${clientDataDir} --meta --mk
node Tools.js ${serverScriptDir} --rm --mk
node Tools.js ${serverDataDir} --rm --mk
#node Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b
 
# pause
