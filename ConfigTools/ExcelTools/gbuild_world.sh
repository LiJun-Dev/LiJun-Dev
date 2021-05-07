#!/bin/sh
spreadsheet_id="1N2SunN8LDRsK3IOtBYwtSfL0W-KvbiPeJcKk8EBj7xM"
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
jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/WorldConfig/"
fileName="world"

#clean directory, some file may be already deleted
#node --debug Tools.js ${clientScriptDir} --meta --mk
#node --debug Tools.js ${clientDataDir} --meta --mk
#node --debug Tools.js ${serverScriptDir} --rm --mk
#node --debug Tools.js ${serverDataDir} --rm --mk
#node --debug Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b

# pause
