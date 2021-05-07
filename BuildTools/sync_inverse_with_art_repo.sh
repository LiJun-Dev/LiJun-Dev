#!/bin/sh

echo "开始将代码仓库资源同步到美术仓库"

rsync -av ../Hotel1/Assets/Res ../../Hotel1Res/Hotel1/Assets 
rsync -av ../Hotel1/Assets/Export/UI ../../Hotel1Res/Hotel1/Assets/Export

