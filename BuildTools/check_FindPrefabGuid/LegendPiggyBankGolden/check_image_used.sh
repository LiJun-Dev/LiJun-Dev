#!/bin/sh
curpath=$(pwd)
resType=LegendPiggyBank/Golden
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python ../check_find_all.py ${assetspath}/Export/UI/${resType} ${curpath}/res_paths_for_check_FindPrefabGuid.txt ${curpath}/../ResPathCommon.txt
