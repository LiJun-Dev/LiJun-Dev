#!/bin/sh

account="shuang.qu@dragonplus.com"
# spreadsheet_id="1OP8zUb8A518dh-PVMZFufp0ggBUGtnea6mS_GJneU7I"
# debug
#spreadsheet_id="1ZlslnpUS5_YILfhJFMJTjXDIajSrM1hVaShA3jtZmMw"
# server

map_sheet_ids=([1]="12ImZso9oB2u3lhpKnrTx_qyPLySP7g0h8sr4F3R23R4" [2]="1uHn6s92EJ5ukm_RZsW5A9fDlW_GCJS3k991JanfYMsk" [3]="1633Yn1oIcBJzoQ2sQJP2DFgqebr2Zqm8vjULfZx3T0s"
[4]="1PiKq4sVgUc1CIt6VE5vDPiURy27MqzaduMNeS_Kbics" [5]="1rflh5g8z3Fqj_Qz-xbYZVHg65mUpIPtNvdPBy4MO__M" [6]="1T30aPh-T5fyIGx0WdkBfC3hFH9zGk2OMwCtCvhvgIg8"
[7]="1RNkjljoM_0SHCtvuKKBwDXsmko2tbuxTe1l1mD9BG5c" [8]="1NZ0CtuTuHhHs6OzbGnmClNWnY7FKZ_dimrO5khkt6nk" [9]="1pH0L8Hk_ZonyOr_ZSEb87ype_LeKcZBFY86_GJUyuEU"
[10]="13xFyC12dQDOJjU47-_Y9q_HOTy5RhJunKSAsk0z1X54" [11]="1RuNpqA4BeXFMYmCZNSrOAgahOYVxTG-qNErCuvLgx1w" [12]="1J3GuWQHayjkUcxPIY398zvZlXaoxStYnv4ojmBgkkl8"
[13]="1HZ2zcnpOlLMItly9aYvs8a8MWq8rVkWErt7k57YAkWE" [14]="1eqR9mrGMCySuzcR2t5sv4mS1hEi1qls-VfPdN5xlAzw")

if [ "$#" -lt "1" ] ; then
    echo "use all sheet!"
    sheets=${!map_sheet_ids[@]}
else
    sheets=($1)
fi

read  key

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
    jsonDataDir="${rootDir}/../../Cooking2/Assets/Export/Configs/Map${key}Config/"
    #output json filename
    fileName="mapconfigs"


    #clean directory, some file may be already deleted
    node Tools.js ${clientScriptDir} --meta --mk
    node Tools.js ${clientDataDir} --meta --mk
    node Tools.js ${serverScriptDir} --rm --mk
    node Tools.js ${serverDataDir} --rm --mk
    node Tools.js ${jsonDataDir} --rm --mk

    # node --debug gDocBuilder.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -u ${account} -p ${password}
    node gDocBuilder_v2.js ${spreadsheet_id} ${clientScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} --oauth2 -j ${jsonDataDir} -f ${fileName} -b

    jsonPath="${jsonDataDir}${fileName}.json"

    python convert_map.py -i ${jsonPath} -d ${jsonPath} -m ${key}

# pause
