#!/bin/sh
BASEDIR=$(dirname $0)
curDir=`pwd`
cd ${BASEDIR}

#参数1传 map id，参数2传 true/false 表示是否同步多语言
echo "参数1传 map id，参数2传 true/false 表示是否同步多语言"

echo "同步map"
sh gbuild_map.sh $1

if "$2" ; then
echo "同步多语言"
sh gbuild_i18n.sh
fi

echo "同步data"
sh gbuild_game.sh

# echo "同步npc"
# sh gbuild_npc.sh

echo "同步world"
sh gbuild_world.sh

echo "同步引导"
sh gbuild_gameguide.sh

echo "同步用户分层"
sh gbuild_usergroup.sh

echo "同步特权卡"
sh gbuild_event_privilegecard.sh

echo "同步召回活动"
sh gbuild_event_recall.sh

# # back
cd ${curDir}
