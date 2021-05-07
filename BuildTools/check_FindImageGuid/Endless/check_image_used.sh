#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/EndlessMode ${assetspath}/Res/UI/Endless ${curpath}/check_image_ignore
