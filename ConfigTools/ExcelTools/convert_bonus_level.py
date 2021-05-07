#!/usr/bin/python
#-*- coding: UTF-8 -*-

import sys
import os, os.path
import json
from optparse import OptionParser
import collections
from collections import OrderedDict

AREA_COOK = 1
AREA_DISH = 2
AREA_TRAY = 3

def outputFile(json_content, output_path):
    jsonStr = json.dumps(json_content, indent=4, separators=(',', ': '))
    fw = open(output_path, "w")
    fw.write(jsonStr)
    fw.close()

def convertLevelConfigMapId(json_content, map_id):
    levels = json_content["level"]
    for level in levels:
        level["levelId"] = int(level["levelId"]) + 1000 * int(map_id)


def getMapFoods(root_path, map_id):
    input_path = os.path.join(root_path, "map" + str(map_id), "mapconfigs.json")
    f = file(input_path, 'r')
    input_json = json.load(f, object_pairs_hook=OrderedDict)
    return input_json["food"]


def convertFoodNameToFoodId(json_content, root_path):
    timeline = json_content["maptimeline"]

    for single_timeline in timeline:
        level_id = single_timeline["levelId"]
        map_id = int(level_id / 1000)

        foods = getMapFoods(root_path, map_id)
        food_dict = {}
        for val in foods:
            food_dict[val["name"]] = val["id"]

        for key in single_timeline:
            customer_config = single_timeline[key]
            if (customer_config is None):
                continue
            if (not isinstance(customer_config, dict)):
                continue
            foods = customer_config["foods"]
            new_foods = []
            for food in foods:
                if (food_dict.has_key(food)):
                    new_foods.append(food_dict[food])
                else:
                    print "error find food :" + str(food)
            customer_config["foods"] = new_foods

# -------------- main --------------
if __name__ == '__main__':

    parser = OptionParser(usage="%prog -r", version="%prog 1.0")
    parser.add_option("-r", "--root", dest="root_path", help='root path')
    (opts, args) = parser.parse_args()

    # try:
    if (opts.root_path is None):
        print "root is none"
        sys.exit(1)

    input_path = os.path.join(opts.root_path, "bonuslevelconfig/bonuslevelconfig.json")

    f = file(input_path, 'r')
    input_json = json.load(f, object_pairs_hook=OrderedDict)

    convertFoodNameToFoodId(input_json, opts.root_path)
    outputFile(input_json, input_path)

    # except Exception as e:
    #     print e
    #     sys.exit(1)



