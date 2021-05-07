BASEDIR=$(dirname $0)

while read line;do  
    eval "$line"  
done < ${BASEDIR}/local_env

echo "本地的unity命令是：${UNITY_EXE}"
echo "Build Log File是：${LOCAL_LOG_FILE}"


BASEDIR=$(dirname $0)
MY_WORKSPACE=${BASEDIR}/..
LOCAL_AB_PATH=${MY_WORKSPACE}/Hotel1/Assets/StreamingAssets
REMOTE_RES_PATH=cookinghot
BUILD_LOG=${MY_WORKSPACE}/${LOCAL_LOG_FILE}

echo "清理本地AB包..."
echo "本地AB包的位置：${LOCAL_AB_PATH}"
rm -rf ${LOCAL_AB_PATH}/*

echo "启动unity打包"
${UNITY_EXE} -quit -batchmode -serial SC-4XRH-75D5-E53G-3YHQ-ZXZJ -username baolong.jia@dragonplus.com -password Drag0nPlus123 -projectPath ${MY_WORKSPACE}/Hotel1 -logFile ${BUILD_LOG} -executeMethod DragonU3DSDK.Asset.BuildAssetBundles.BuildAllAssetBundle
unity_build_ret=$?
echo "打包结果 ${unity_build_ret}"
if [ ${unity_build_ret} != 0 ]; then
     exit -1
fi

echo "上传AB包到测试用的 资源更新服 ..."
echo "资源在服务器上的相对路径：${REMOTE_RES_PATH}" 
sh ${MY_WORKSPACE}/BuildTools/sync_to_debug_res_server.sh ${MY_WORKSPACE}/Hotel1/Assets/AssetBundleOut/ ${REMOTE_RES_PATH}