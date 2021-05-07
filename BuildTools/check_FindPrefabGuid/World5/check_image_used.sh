#!/bin/sh
curpath=$(pwd)
resType=World5
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python ../check_find_all.py ${assetspath}/Export/UI/${resType} ${curpath}/res_paths_for_check_FindPrefabGuid.txt ${curpath}/../ResPathCommon.txt
python ../check_find_all.py ${assetspath}/Res/World/${resType} ${curpath}/res_paths_for_check_FindPrefabGuid.txt ${curpath}/../ResPathCommon.txt