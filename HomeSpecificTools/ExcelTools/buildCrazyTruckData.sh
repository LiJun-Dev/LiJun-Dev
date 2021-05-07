BASEDIR=$(dirname $0)
echo "change dir to script location: ${BASEDIR}"
cd ${BASEDIR}

while read line;do  
    eval "$line"  
done < ${BASEDIR}/project_env

echo "data生成的c-sharp文件路径是：${DATA_SCRIPT_HOME}"
echo "data生成的json文件路径是：${DATA_JSON_HOME}"


rootDir=`pwd`
#client script directory
unityScriptDir="${rootDir}/../../${DATA_SCRIPT_HOME}"
#output json directory
jsonDataDir="${rootDir}/../../${DATA_JSON_HOME}"

export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
deco_id="1p9mHTloR-W37IHkDB7x0yyqZM24cdCv6c7oGXCZPp_Q"

/usr/local/bin/node --inspect Js/gDocBuilderClean.js ${deco_id} ${unityScriptDir} ${jsonDataDir} ${buildCode} -b

echo "Finished"
# pause
cd ${curDir}
