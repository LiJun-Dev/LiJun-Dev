#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/Map5 ${assetspath}/Res/Maps/Map5 ${curpath}/check_image_ignore
