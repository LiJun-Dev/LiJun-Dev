import sys
import os
import shutil

SCRIPT_PATH = os.path.split(os.path.realpath(__file__))[0]

ConfigurationController = os.path.abspath(os.path.join(SCRIPT_PATH, '../Cooking4/Assets/Resources/Settings/ConfigurationController.asset'))

def Update(ReleaseBuildAppBundle):
	print('ConfigurationController:ReleaseBuildAppBundle:' + str(ReleaseBuildAppBundle))

	content = ''
	with open(ConfigurationController, 'r') as f:
		line = f.readline()
		while line:
			if line.find('  DebugBuildAppBundle: ') >= 0:
				line = '  DebugBuildAppBundle: 0\n'
			elif line.find('  ReleaseBuildAppBundle: ') >= 0:
				line = '  ReleaseBuildAppBundle: ' + str(ReleaseBuildAppBundle) + '\n'
			if line.find('  version: ') >= 0:
				line = '  version: 0\n'
			content += line
			line = f.readline()

		if content.find('  DebugBuildAppBundle: ') < 0:
			content += '\n  DebugBuildAppBundle: 0\n'
		if content.find('  ReleaseBuildAppBundle: ') < 0:
			content += '  ReleaseBuildAppBundle: ' + str(ReleaseBuildAppBundle) + '\n'

	with open(ConfigurationController, 'w') as f:
		if len(content) > 0:
			f.write(content)
	
	print('ConfigurationController:' + ConfigurationController)


if __name__ == '__main__':
	if len(sys.argv) <= 0:
		pass
	Update(sys.argv[1])