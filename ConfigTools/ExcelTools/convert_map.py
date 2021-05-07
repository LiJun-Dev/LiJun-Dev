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
AREA_ANIM = 4

def outputFile(json_content, output_path):
    jsonStr = json.dumps(json_content, indent=4, separators=(',', ': '))
    fw = open(output_path, "w")
    fw.write(jsonStr)
    fw.close()

def convertLevelConfigMapId(json_content, map_id):
    levels = json_content["level"]
    for level in levels:
        level["levelId"] = int(level["levelId"]) + 1000 * int(map_id)

def convertFoodNameToFoodId(json_content,timeline_name):
    timeline = json_content[timeline_name]
    food = json_content["food"]

    food_dict = {}
    for val in food:
        food_dict[val["name"]] = val["id"]

    for single_timeline in timeline:
        for key in single_timeline:
            customer_config = single_timeline[key]
            if (customer_config is None):
                continue
            if (not isinstance(customer_config, dict)):
                continue
            foods = customer_config["foods"]
            new_foods = []
            for food in foods:
                if food in food_dict.keys():
                    new_foods.append(food_dict[food])
                else:
                    print("error find food :" + str(food))
            customer_config["foods"] = new_foods
            
def convertFoodNameToFoodId_b(json_content):
    convertFoodNameToFoodId(json_content,"timeline")
    if "timeline_b" in json_content:
        convertFoodNameToFoodId(json_content,"timeline_b")

def convertTimeLine(json_content,timeline_name):
    timeline = json_content[timeline_name]
    new_timeline = []

    for single_timeline in timeline:
        new_single_timeline = {}
        new_single_timeline["levelId"] = single_timeline["levelId"]
        new_customer_config_list = []
        for key in single_timeline:
            customer_config = single_timeline[key]
            if (customer_config is None):
                continue
            if (not isinstance(customer_config, dict)):
                continue
            new_customer_config_list.append(customer_config)
        new_single_timeline["infos"] = new_customer_config_list   
        new_timeline.append(new_single_timeline)
    json_content[timeline_name] = new_timeline
    
def convertTimeLine_b(json_content):
    convertTimeLine(json_content,"timeline")
    if "timeline_b" in json_content:
        convertTimeLine(json_content,"timeline_b")

def addAreaTypeInfo(json_content):
    trayareaconfigs = json_content["trayareaconfigs"]
    for val in trayareaconfigs:
        val["type"] = AREA_TRAY
    dishareaconfigs = json_content["dishareaconfigs"]
    for val in dishareaconfigs:
        val["type"] = AREA_DISH
    cookareaconfigs = json_content["cookareaconfigs"]
    for val in cookareaconfigs:
        val["type"] = AREA_COOK
    animareaconfigs = json_content["animareaconfigs"]
    for val in animareaconfigs:
        val["type"] = AREA_ANIM





# -------------- main --------------
if __name__ == '__main__':

    parser = OptionParser(usage="%prog -r", version="%prog 1.0")
    parser.add_option("-d", "--dest", dest="dest_path",help='output path')
    parser.add_option("-i", "--input", dest="input_path", help='input path')
    parser.add_option("-m", "--map_id", dest="map_id", help='map id')
    (opts, args) = parser.parse_args()

    # try:
    if (opts.input_path is None):
        print("input_path is none")
        sys.exit(1)

    if (opts.dest_path is None):
        print("output_path is none")
        sys.exit(1)

    if (opts.map_id is None):
        print("map_id is none")
        sys.exit(1)

    f = open(opts.input_path, 'r')
    input_json = json.load(f, object_pairs_hook=OrderedDict)
    # convertLevelConfigMapId(input_json, opts.map_id)
    convertFoodNameToFoodId_b(input_json)
    convertTimeLine_b(input_json)
    #addAreaTypeInfo(input_json)
    outputFile(input_json, opts.dest_path)

    # except Exception as e:
    #     print e
    #     sys.exit(1)



