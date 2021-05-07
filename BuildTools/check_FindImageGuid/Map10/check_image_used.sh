#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/Map10 ${assetspath}/Res/Maps/Map10 ${curpath}/check_image_ignore
