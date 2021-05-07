#!/bin/sh

account="shuang.qu@dragonplus.com"

spreadsheet_id="17No-1be2FsPOl_me774l7XK290wxAOKhyL2P0q2w-6g"

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
jsonDataDir="${rootDir}/../../Hotel1/Assets/Export/Configs/UserGroupConfig/"
#output json filename
fileName="usergroup"


#clean directory, some file may be already deleted
#node Tools.js ${clientScriptDir} --meta --mk
#node Tools.js ${clientDataDir} --meta --mk
#node Tools.js ${serverScriptDir} --rm --mk
#node Tools.js ${serverDataDir} --rm --mk
#node Tools.js ${jsonDataDir} --rm --mk

# node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b
 
 # pause