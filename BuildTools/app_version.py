#!/usr/bin/python

import sys
import os
import shutil

class AppInfo:
	def __init__(self, platform, version, code, res_ver, packageSounds):
		self.platform = platform
		self.version = version
		self.code = code
		self.res_ver = res_ver
		self.packageSounds = packageSounds

#                      platform  version  code  res_ver   sounds
info_Android = AppInfo('Android', '0.0.1', '1', 'v0_0_1', False)
info_iOS     = AppInfo('iOS',     '0.0.1', '1', 'v0_0_1', True)

info_Android_Debug = AppInfo('Android', '0.0.14', '14', 'v0_0_14', False)
info_iOS_Debug     = AppInfo('iOS',     '0.0.14', '14', 'v0_0_14', True)

SCRIPT_PATH = os.path.split(os.path.realpath(__file__))[0]

ProjectSettings = os.path.abspath(os.path.join(SCRIPT_PATH, '../Hotel1/ProjectSettings/ProjectSettings.asset'))
bundleVersion            = '  bundleVersion: '
AndroidBundleVersionCode = '  AndroidBundleVersionCode: '
buildNumber              = '  buildNumber:'
# buildNumber:
#    iOS: 10

AssetConfigController = os.path.abspath(os.path.join(SCRIPT_PATH, '../Hotel1/Assets/Resources/Settings/AssetConfigController.asset'))
RootVersion    = '  RootVersion: '
IOSRootVersion = '  IOSRootVersion: '
VersionCode    = '  VersionCode: '
IOSVersionCode = '  IOSVersionCode: '
Audios_Sound   = '    - Path: Audios/Sound'
#    - Path: Audios/Sound
#      InInitialPacket: 1

AppInfo = os.path.abspath(os.path.join(SCRIPT_PATH, '../Hotel1/Assets/Resources/Settings/AppInfo.asset'))
JenkinsBuildNumber = '  JenkinsBuildNumber: '
GitBranchName = '  GitBranchName:'



def update_app_version(app_info):
	print('update_app_version >>>')
	print(app_info)
	content = ''
	with open(ProjectSettings, 'r') as f:
		line = f.readline()
		found_buildNumber = False
		while line:
			# version
			if line.find(bundleVersion) >= 0:
				line = bundleVersion + app_info.version + '\n'
			# code
			elif line.find(AndroidBundleVersionCode) >= 0:
				line = AndroidBundleVersionCode + app_info.code + '\n'
			# code
			elif line.find(buildNumber) >= 0:
				found_buildNumber = True
			elif found_buildNumber:
				found_buildNumber = False
				line = '    iOS: ' + app_info.code + '\n'

			content += line
			line = f.readline()
	with open(ProjectSettings, 'w') as f:
		if len(content) > 0:
			f.write(content)
	print('    ' + ProjectSettings)

	content = ''
	with open(AssetConfigController, 'rw') as f:
		content = ''
		line = f.readline()
		found_buildNumber = False
		remove_sounds = False
		while line:
			# res_ver
			if line.find(RootVersion) >= 0:
				line = RootVersion + app_info.res_ver + '\n'
			elif line.find(IOSRootVersion) >= 0:
				line = IOSRootVersion + app_info.res_ver + '\n'
			# code
			elif line.find(VersionCode) >= 0:
				line = VersionCode + app_info.code + '\n'
			elif line.find(IOSVersionCode) >= 0:
				line = IOSVersionCode + app_info.code + '\n'
			# sounds
			elif line.find(Audios_Sound) >= 0 and False == app_info.packageSounds:
				if remove_sounds == False:
					remove_sounds = True
					line = ''
			elif remove_sounds:
				remove_sounds = False
				line = ''

			content += line
			line = f.readline()
	with open(AssetConfigController, 'w') as f:
		if len(content) > 0:
			f.write(content)
	print('    ' + AssetConfigController)
	print('update_app_version <<<')
	pass

def update_debug_info(buildNumber, GIT_BRANCH):
	print('update_debug_info >>>')
	print(buildNumber)
	print(GIT_BRANCH)
	content = ''
	with open(AppInfo, 'rw') as f:
		content = ''
		line = f.readline()
		while line:
			if line.find(JenkinsBuildNumber) >= 0:
				line = JenkinsBuildNumber + buildNumber + '\n'
			elif line.find(GitBranchName) >= 0:
				line = GitBranchName + ' ' + GIT_BRANCH + '\n'
			content += line
			line = f.readline()
	with open(AppInfo, 'w') as f:
		if len(content) > 0:
			f.write(content)
		print('    ' + content)
	print('    ' + AppInfo)
	print('update_debug_info <<<')
	pass

# update_app_version(Android)
# update_app_version(iOS)

if __name__ == '__main__':
	cnt = len(sys.argv)
	if cnt <= 0:
		pass
	print(sys.argv)
	JOB_NAME = sys.argv[1]
	BUILD_NUMBER = '0'
	if cnt > 2:
		BUILD_NUMBER = sys.argv[2]
	GIT_BRANCH = ''
	if cnt > 3:
		GIT_BRANCH = sys.argv[3]
	print('jenkins info:JOB_NAME:     ' + JOB_NAME)
	print('jenkins info:BUILD_NUMBER: ' + BUILD_NUMBER)
	print('jenkins info:GIT_BRANCH:   ' + GIT_BRANCH)

	job_name = JOB_NAME.lower()
	iOS = True
	release = True
	if job_name.find('android') > 0:
		iOS = False
	if job_name.find('debug') > 0:
		release = False

	# update_debug_info(BUILD_NUMBER, GIT_BRANCH)
	if release:
		if iOS:
			update_app_version(info_iOS)
		else:
			update_app_version(info_Android)
	else:
		if iOS:
			update_app_version(info_iOS_Debug)
		else:
			update_app_version(info_Android_Debug)

