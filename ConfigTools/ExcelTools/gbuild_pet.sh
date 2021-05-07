#!/bin/sh
spreadsheet_id="1lraBdXjj1GfA0eR_lkKuocbe4D4eeRHW9ABN2x7aTgw"
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
jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/Pet"
#output json filename
fileName="pet"

#clean directory, some file may be already deleted
node Tools.js ${clientScriptDir} --meta --mk
node Tools.js ${clientDataDir} --meta --mk
node Tools.js ${serverScriptDir} --rm --mk
node Tools.js ${serverDataDir} --rm --mk
#node Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b
 
# pause
