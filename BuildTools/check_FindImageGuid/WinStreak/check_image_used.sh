#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/WinStreak ${assetspath}/Res/UI/WinStreak ${curpath}/check_image_ignore
