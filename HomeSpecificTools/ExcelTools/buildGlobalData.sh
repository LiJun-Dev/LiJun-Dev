BASEDIR=$(dirname $0)
echo "change dir to script location: ${BASEDIR}"
cd ${BASEDIR}

while read line;do  
    eval "$line"  
done < ${BASEDIR}/project_env

echo "data生成的c-sharp文件路径是：${DATA_SCRIPT_GLOBAL}"
echo "data生成的json文件路径是：${DATA_JSON_GLOBAL}"


rootDir=`pwd`
#client script directory
unityScriptDir="${rootDir}/../../${DATA_SCRIPT_GLOBAL}"
#output json directory
jsonDataDir="${rootDir}/../../${DATA_JSON_GLOBAL}"

#下面这句是代理设置，目前不能翻，需要换端口。wifi可以翻墙就直接屏蔽了。
#export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
deco_id="1EPtwv3Ea1lWrv-E7V1NSeNZ3ODsPWbfyuN0OIs_fcTY"

/usr/local/bin/node --inspect Js/gDocBuilderClean.js ${deco_id} ${unityScriptDir} ${jsonDataDir} ${buildCode} -b

echo "Finished"
# pause
cd ${curDir}
