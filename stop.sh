#!/bin/sh

if [ $# -ne 1 ]; then
    echo "Use it like this"
    echo "eg) ./stop.sh 0 "
    echo "arg 1 - node no"
    exit -1
fi

echo "Dprep Node$1 Stop..."

PID=`ps -ef | grep DPrepMultinode$1 | grep -v grep | awk ' {print $2}'`
kill -9 $PID &>/dev/null || exit 0
