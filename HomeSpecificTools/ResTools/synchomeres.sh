#!/bin/sh

#代码部分分为两个函数,分别为 art_repo=>code_repo 和 code_repo=>art_repo 同步

function funSyncArt2Code(){
cd ../../BuildTools/
./delete_then_sync_with_art_repo_onlyhome.sh
}

function funSyncCode2Art(){

cd ../../BuildTools/
./delete_then_sync_with_art_repo_onlyhome.sh 1
}


if [ $# == 0 ]
then
    funSyncArt2Code
else
    funSyncCode2Art
fi




