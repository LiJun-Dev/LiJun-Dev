#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/PiggyBank ${assetspath}/Res/UI/PiggyBank ${curpath}/check_image_ignore
