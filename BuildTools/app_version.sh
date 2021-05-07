#!/usr/bin/env bash

BASEDIR=$(dirname $0)

# checks if branch has something pending
function parse_git_dirty() {
  git diff --quiet --ignore-submodules HEAD 2>/dev/null; [ $? -eq 1 ] && echo "*"
}

# gets the current git branch
function parse_git_branch() {
  git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/\1$(parse_git_dirty)/"
}

# get last commit hash prepended with (i.e. 8a323d0)
function parse_git_hash() {
  git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/\1/"
}

# DEMO
# GIT_BRANCH=$(parse_git_branch)$(parse_git_hash)
# echo ${GIT_BRANCH}
# JOB_NAME=0
# BUILD_NUMBER=0

python ${BASEDIR}/app_version.py ${JOB_NAME} ${BUILD_NUMBER} $(parse_git_hash)
# python ${BASEDIR}/app_version.py "Hotel1_Release_Android" "-1" $(parse_git_hash)
# python ${BASEDIR}/app_version.py "Hotel1_Release_iOS" "-1" $(parse_git_hash)