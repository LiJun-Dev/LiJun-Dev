#!/bin/sh

echo "开始将美术资源同步至代码仓库"
echo "Syncing Hotel1Res to Hotel1"

rsync -av ../../Hotel1Res/ConfigTools/ExcelTools ../ConfigTools
#rsync -av ../../Hotel1Res/Hotel1/Assets/Export/Configs ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Res ../Hotel1/Assets
rsync -av ../../Hotel1Res/Hotel1/Assets/Export/UI ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Export/Audios ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Export/Share ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Export/Character ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Export/CommonNPC ../Hotel1/Assets/Export
rsync -av ../../Hotel1Res/Hotel1/Assets/Resources/Export/Fonts ../Hotel1/Assets/Resources/Export/

