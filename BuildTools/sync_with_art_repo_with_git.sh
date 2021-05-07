#!/bin/sh
echo "拉取资源库到最新版本"
cd ../../Hotel1Res
git stash
git pull --rebase
git stash pop
git status
echo "资源库已经拉取到最新"
cd ../Hotel1/BuildTools
sh sync_with_art_repo.sh
