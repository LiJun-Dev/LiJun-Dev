#!/bin/sh
BASEDIR=$(dirname $0)
echo "change dir to script location: ${BASEDIR}"
cd ${BASEDIR}

while read line;do  
    eval "$line"  
done < ${BASEDIR}/project_env

echo "data生成的json文件路径是：${STORAGE_JSON}"

#export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;


#spreadsheet_id="1d_kDSQADGgXz744uB9ckbAHLxYabqey0lEd8XNV2CSs"
#spreadsheet_id="1JEmDq0s3LEUyPv3JnQ7wMvCpN4aIXQL_2pbECIWEVcQ"
spreadsheet_id="1oCtBoTiYgzJWDf36vnyN8am8baNfRJoBnzpXrTOtT3o"

rootDir=`pwd`
#client script directory
unityScriptDir="${rootDir}/../../${STORAGE_SCRIPT_HOME}"

/usr/local/bin/node --inspect Js/Tools.js ${unityScriptDir} --meta --mk


#client data directory
clientDataDir="${rootDir}/tmp/tables/"
#server script directory
serverScriptDir="${rootDir}/tmp/src/"
#server data directory
serverDataDir="${rootDir}/tmp/table/"
#output json directory
jsonDataDir="${rootDir}/../${STORAGE_JSON}"
classTemplate="./Template/UnityStorage.template"

# node ./JS/gDocBuilder.js ${spreadsheet_id} ${unityScriptDir} ${clientDataDir} ${serverScriptDir} ${serverDataDir} -j ${jsonDataDir} -b -s
node --inspect Js/gDocBuilderTemplate.js ${spreadsheet_id} ${unityScriptDir} ${classTemplate}
echo "Finished"