#!/bin/sh

echo "开始将美术资源同步至代码仓库"
echo "Syncing Dev01Res to Dev01"

rsync -av --delete ../../Lijun_Dev01Res/Dev01Res/Assets/Export/ ../Dev01/Assets/Export/

