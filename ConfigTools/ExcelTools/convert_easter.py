#!/usr/bin/python
#-*- coding: UTF-8 -*-

import sys
import os, os.path
import json
from optparse import OptionParser
import collections
from collections import OrderedDict

def outputFile(json_content, output_path):
    jsonStr = json.dumps(json_content, indent=4, separators=(',', ': '))
    fw = open(output_path, "w")
    fw.write(jsonStr)
    fw.close()

def convertFoodNameToFoodId(json_content):
    timeline = json_content["timeline"]
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
                if (food_dict.has_key(food)):
                    new_foods.append(food_dict[food])
                else:
                    print "error find food :" + str(food)
            customer_config["foods"] = new_foods
    json_content["food"] = {}

def convertTimeLine(json_content):
    timeline = json_content["timeline"]
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
    json_content["timeline"] = new_timeline


# -------------- main --------------
if __name__ == '__main__':

    parser = OptionParser(usage="%prog -r", version="%prog 1.0")
    parser.add_option("-d", "--dest", dest="dest_path",help='output path')
    parser.add_option("-i", "--input", dest="input_path", help='input path')
    (opts, args) = parser.parse_args()

    # try:
    if (opts.input_path is None):
        print "input_path is none"
        sys.exit(1)

    if (opts.dest_path is None):
        print "output_path is none"
        sys.exit(1)

    f = file(opts.input_path, 'r')
    input_json = json.load(f, object_pairs_hook=OrderedDict)

    convertFoodNameToFoodId(input_json)
    convertTimeLine(input_json)
    outputFile(input_json, opts.dest_path)

    # except Exception as e:
    #     print e
    #     sys.exit(1)



