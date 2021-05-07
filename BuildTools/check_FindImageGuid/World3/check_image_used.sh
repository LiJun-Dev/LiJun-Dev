#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/World3 ${assetspath}/Res/World/World3 ${curpath}/check_image_ignore
