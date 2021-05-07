#!/bin/sh

account="shuang.qu@dragonplus.com"
# spreadsheet_id="1OP8zUb8A518dh-PVMZFufp0ggBUGtnea6mS_GJneU7I"
# debug
#spreadsheet_id="1ZlslnpUS5_YILfhJFMJTjXDIajSrM1hVaShA3jtZmMw"
# server

map_sheet_ids=([98]="168OFYIr-bn3tZyHY56b5IMYhpSFh0SL3uqH4BlndtJg")
if [ "$#" -lt "1" ] ; then
    echo "use all sheet!"
    sheets=${!map_sheet_ids[@]}
else
    sheets=($1)
fi

for key in ${sheets[@]}; do
    spreadsheet_id=${map_sheet_ids[$key]}
    #spreadsheet_id="1GHLcQXNfUc2Utgy_YjoHPni6wVP9dgJ_Rp_J8NLJfxE"
    echo "map sheet:" $spreadsheet_id

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
    jsonDataDir="${rootDir}/../../Cooking2/Assets/Export/Configs/Map${key}ActivityConfig/"
    #output json filename
    fileName="mapconfigs"


    #clean directory, some file may be already deleted
    node --inspect Tools.js ${clientScriptDir} --meta --mk
    node --inspect Tools.js ${clientDataDir} --meta --mk
    node --inspect Tools.js ${serverScriptDir} --rm --mk
    node --inspect Tools.js ${serverDataDir} --rm --mk
    node --inspect Tools.js ${jsonDataDir} --rm --mk

    # node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
    node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b

    jsonPath="${jsonDataDir}${fileName}.json"

    python convert_map.py -i ${jsonPath} -d ${jsonPath} -m ${key}
done 
# pause
