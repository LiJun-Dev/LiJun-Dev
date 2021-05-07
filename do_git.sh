#!/bin/bash
git status
git stash
git pull --rebase
git stash pop
git status
