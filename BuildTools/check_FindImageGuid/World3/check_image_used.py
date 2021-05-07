import os
import re
import sys

def checkfiles(path, allfile):
	filelist = os.listdir(path)
	for filename in filelist:
		filepath = os.path.join(path, filename)
		if os.path.isdir(filepath):
			checkfiles(filepath, allfile)
		else:
			if filepath.endswith("png.meta") or filepath.endswith("jpg.meta") :
				allfile.append(filepath)
	return allfile


def getprefabfiles(path, allfile):
	filelist = os.listdir(path)
	for filename in filelist:
		filepath = os.path.join(path, filename)
		if os.path.isdir(filepath):
			getprefabfiles(filepath, allfile)
		else:
			if filepath.endswith(".prefab"):
				allfile.append(filepath)
	return allfile


def check(prefabpath, respath, ignoreconfigfile):
	ignoreFile = open(ignoreconfigfile, "r")
	ignoreData = ignoreFile.read()
	prefabs = getprefabfiles(prefabpath, [])
	allres = checkfiles(respath, [])

	for imageMeta in allres:
		imageFile = open(imageMeta, "r")
		lines = imageFile.readlines()
		for line in lines:
			if "guid: " in line:
				p = re.compile("guid: .+", re.S)
				guid = re.findall(p, line)[0][6:-1]
				findRes = False
				for prefab in prefabs:
					prefabfile = open(prefab, "r")
					prefabData = prefabfile.read()
					searchresult = re.search(guid, prefabData)
					if not searchresult is None:
						findRes = True

					prefabfile.close()

				if findRes == False:
					searchName = re.findall(re.compile("Res/.+\.meta", re.S), imageMeta)[0][0:-5]
					# print searchName
					searchIgnoreResult = re.search(searchName, ignoreData)
					if searchIgnoreResult is None:
						print "Image : " + imageMeta + " not found used"	

		imageFile.close()
	ignoreFile.close()
	return	


def main():
	if len(sys.argv) != 4 :
		print "argvs error"
	else : 
		check(sys.argv[1], sys.argv[2], sys.argv[3])

	return


main()


