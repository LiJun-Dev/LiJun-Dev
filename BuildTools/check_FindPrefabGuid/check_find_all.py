import os
import re
import sys
import numpy as np

assetspath="/Users/lu/Documents/Cooking2/Cooking2/Cooking2/Assets/"

configArr = (
	{
		"findName": "check_find_anim_in_animCtr",
		"checkFilesValue": ".anim.meta",
		"getPrefabFilesValue": ".controller",
		"findString": "fileID: 7400000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_animCtr_in_prefab",
		"checkFilesValue": ".controller.meta",
		"getPrefabFilesValue": ".prefab",
		"findString": "fileID: 9100000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_image_in_anim",
		"checkFilesValue": ".meta",
		"getPrefabFilesValue": ".anim",
		"findString": "m_Sprite: {fileID: 21300000, ",
		"findResCommon": True,
	},
	{
		"findName": "check_find_image_in_prefab",
		"checkFilesValue": ".meta",
		"getPrefabFilesValue": ".prefab",
		"findString": "m_Sprite: {fileID: 21300000, ",
		"findResCommon": True,
	}, 
	{
		"findName": "check_find_spineSkeletonData_in_prefab",
		"checkFilesValue": ".asset.meta",
		"getPrefabFilesValue": ".prefab",
		"findString": "skeletonDataAsset: {fileID: 11400000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_spineJson_in_spineSkeletonData",
		"checkFilesValue": ".json.meta",
		"getPrefabFilesValue": ".prefab",
		"findString": "skeletonJSON: {fileID: 4900000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_spineAtlas_in_spineSkeletonData",
		"checkFilesValue": ".asset.meta",
		"getPrefabFilesValue": ".asset",
		"findString": "- {fileID: 11400000,",
		"findResCommon": True,
	},
	{
		"findName": "check_find_spineMaterial_in_spineAtlas",
		"checkFilesValue": ".mat.meta",
		"getPrefabFilesValue": ".asset",
		"findString": "fileID: 2100000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_spineTxt_in_spineAtlas",
		"checkFilesValue": ".txt.meta",
		"getPrefabFilesValue": ".asset",
		"findString": "atlasFile: {fileID: 4900000",
		"findResCommon": True,
	},
	{
		"findName": "check_find_spinePng_in_spineMaterial",
		"checkFilesValue": ".png.meta",
		"getPrefabFilesValue": ".mat",
		"findString": "fileID: 2800000",
		"findResCommon": True,
	},
)

def checkfiles(path, allfile, config):
	filelist = os.listdir(path)
	for filename in filelist:
		filepath = os.path.join(path, filename)
		if os.path.isdir(filepath):
			checkfiles(filepath, allfile, config)
		else:
			if filepath.endswith(config["checkFilesValue"]):
				allfile.append(filepath)
	return allfile


def getprefabfiles(path, allfile, config):
	filelist = os.listdir(path)
	for filename in filelist:
		filepath = os.path.join(path, filename)
		if os.path.isdir(filepath):
			getprefabfiles(filepath, allfile, config)
		else:
			if filepath.endswith(config["getPrefabFilesValue"]):
				allfile.append(filepath)
	return allfile


def check(prefabpath, respath, respathCommon, config):
	prefabs = getprefabfiles(prefabpath, [], config)
	respaths = open(respath, "r")
	respathsliens = respaths.readlines()

	if config["findResCommon"] == True:
		respathsCommon = open(respathCommon, "r")
		respathsCommonliens = respathsCommon.readlines()
		respathsliens = respathsliens + respathsCommonliens

	for prefab in prefabs:
		prefabfile = open(prefab, "r")
		lines = prefabfile.readlines()
		for line in lines:
			if config["findString"] in line:
				findRes = False
				p = re.compile("guid: .*?, type:", re.S)
				guid = re.findall(p, line)[0][6:-7]
				for resline in respathsliens:
					resline = resline.strip('\n')
					resline = assetspath + resline
					allres = checkfiles(resline, [], config) 
					for res in allres:
						resfile = open(res, "r")
						resmeta = resfile.read()
						searchresult = re.search(guid, resmeta)
						if not searchresult is None:
							findRes = True
						resfile.close()

				if findRes == False:
					AssetsIndex = prefab.find("Assets")
					print prefab[AssetsIndex+7:len(prefab)] + ", " + config["findName"] + ", error guid: " + guid

		prefabfile.close()

	respaths.close()	

def main():
	if len(sys.argv) != 4 :
		print "argvs error"
	else : 
		for config in configArr:
			check(sys.argv[1], sys.argv[2], sys.argv[3], config)

	return


main()