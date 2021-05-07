#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../Hotel1/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export ${assetspath}/Res ${curpath}/check_image_ignore
