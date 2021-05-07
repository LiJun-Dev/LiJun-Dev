cd $(dirname $0)/../Hotel1Res
git stash
git pull --rebase

if [ $? -eq 0 ];then
	cd $(dirname $0)/BuildTools
	echo "开始将配置表同步至代码仓库"
	rsync -av --delete ../../Hotel1Res/Hotel1/Assets/Export/Configs ../Hotel1/Assets/Export
fi

cd $(dirname $0)/../Hotel1Res
git stash pop
cd $(dirname $0)