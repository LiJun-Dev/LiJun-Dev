#!/bin/sh

echo " "


if [ $# == 0 ]
then
   source ./synchomeres.sh
   source ./synchotel3res.sh
else
   source ./synchomeres.sh 1
   source ./synchotel3res.sh 1
fi 

