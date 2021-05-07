#!/bin/sh

account="shuang.qu@dragonplus.com"
# spreadsheet_id="1OP8zUb8A518dh-PVMZFufp0ggBUGtnea6mS_GJneU7I"
# debug
#spreadsheet_id="1ZlslnpUS5_YILfhJFMJTjXDIajSrM1hVaShA3jtZmMw"
# server

spreadsheet_id="10Wxe2du5Gt7PAkxqW0x3pnRfHOwD2Ftfwy7auDhCAEM"
#spreadsheet_id="1GHLcQXNfUc2Utgy_YjoHPni6wVP9dgJ_Rp_J8NLJfxE"

# you can save your password here:
password="zen"

if [ ! -n "$password" ] ; then
	echo "please input your google account ${account} 's password..."
	read -s password
else
	echo "use default password."
fi

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
jsonDataDir="${rootDir}/../../Cooking6/Assets/Export/Configs/CommonConfig/"
#output json filename
fileName="guild"


#clean directory, some file may be already deleted
node Tools.js ${clientScriptDir} --meta --mk
node Tools.js ${clientDataDir} --meta --mk
node Tools.js ${serverScriptDir} --rm --mk
node Tools.js ${serverDataDir} --rm --mk
#node Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b
 
# pause
