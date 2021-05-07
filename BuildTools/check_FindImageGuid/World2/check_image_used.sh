#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/World2 ${assetspath}/Res/World/World2 ${curpath}/check_image_ignore
