#!/bin/sh
curpath=$(pwd)
assetspath=${curpath}/../../../Cooking2/Assets
# echo ${assetspath}
python check_image_used.py ${assetspath}/Export/UI/NoDieChallenge ${assetspath}/Res/UI/NoDieChallenge ${curpath}/check_image_ignore
