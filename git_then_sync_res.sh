cd $(dirname $0)/../Lijun_Dev01Res
git stash
git pull --rebase

if [ $? -eq 0 ];then
	cd $(dirname $0)/../Lijun_Dev01/BuildTools
	./delete_then_sync_with_art_repo.sh
fi

cd $(dirname $0)/../Lijun_Dev01Res
git stash pop
cd $(dirname $0)