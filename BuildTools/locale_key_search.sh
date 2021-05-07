#!/bin/bash
cat ../BuildTools/hotel1_key.txt | while read line 
do
	num=`grep -rnw . -e $line | wc -l` 
	echo $line  $num
done
