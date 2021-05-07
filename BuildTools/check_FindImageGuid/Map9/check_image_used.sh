#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/Map9 ${assetspath}/Res/Maps/Map9 ${curpath}/check_image_ignore
