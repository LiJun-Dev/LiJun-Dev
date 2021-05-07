#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/World1 ${assetspath}/Res/World/World1 ${curpath}/check_image_ignore
