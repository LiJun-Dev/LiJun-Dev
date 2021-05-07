
ProjectName=Hotel1
UnityVersion=2018.4.24f1
UnityPath=/Applications/Unity/Hub/Editor/$UnityVersion/Unity.app/Contents/MacOS/Unity

AndroidMoveDestPath=../$ProjectName/Assets/ActivityAssetBundleOut/activityandroid/ActivityAssetBundles
AndroidGeneralPath=../$ProjectName/Assets/AssetBundleOut/android/Activity

iOSMoveDestPath=../$ProjectName/Assets/ActivityAssetBundleOut/activityiphone/ActivityAssetBundles
iOSGeneralPath=../$ProjectName/Assets/AssetBundleOut/iphone/Activity

AssetPaths='UI/WinStreak;SpriteAtlas/UIWinStreakAtlas;UI/PiggyBank;SpriteAtlas/UIPiggyBankAtlas'

# 多个资源路径用分好隔开

if [ "$1" == 'Android' ]; then
    # Android
    echo '开始打包Android活动资源...'
    rm -rf $AndroidGeneralPath
    rm -rf $AndroidMoveDestPath
    if [ ! -d $AndroidMoveDestPath ]; then
      mkdir -p $AndroidMoveDestPath
    fi
    $UnityPath -quit -batchmode -serial SC-4XRH-75D5-E53G-3YHQ-ZXZJ -username 'baolong.jia@dragonplus.com' -password 'Drag0nPlus123' -projectPath $PWD/../$ProjectName -logFile $AndroidMoveDestPath/../BuildAssetBundle.log -executeMethod DragonU3DSDK.Asset.BuildAssetBundles.BuildMultipleActivityAssetBundleWithCommandLine -resPath $AssetPaths -targetPlatform "android" 
    mv $AndroidGeneralPath/*.ab $AndroidMoveDestPath
    rm -rf $AndroidGeneralPath
    echo '打包Android活动资源完成'
elif [ "$1" == 'iOS' ]; then
    # iOS
    echo '开始打包iOS活动资源...'
    rm -rf $iOSGeneralPath
    rm -rf $iOSMoveDestPath
    if [ ! -d $iOSMoveDestPath ]; then
      mkdir -p $iOSMoveDestPath
    fi
    $UnityPath -quit -batchmode -serial SC-4XRH-75D5-E53G-3YHQ-ZXZJ -username 'baolong.jia@dragonplus.com' -password 'Drag0nPlus123' -projectPath $PWD/../$ProjectName -logFile $iOSMoveDestPath/../BuildAssetBundle.log -executeMethod DragonU3DSDK.Asset.BuildAssetBundles.BuildMultipleActivityAssetBundleWithCommandLine -resPath $AssetPaths -targetPlatform "iphone" 
    mv $iOSGeneralPath/*.ab $iOSMoveDestPath
    rm -rf $iOSGeneralPath
    echo '打包iOS活动资源完成'
else
    echo "请输入正确的目标平台 : Android/iOS "
fi




