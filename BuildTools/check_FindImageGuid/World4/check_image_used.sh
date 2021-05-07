#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/World4 ${assetspath}/Res/World/World4 ${curpath}/check_image_ignore
