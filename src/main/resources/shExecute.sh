#!/bin/sh

whoami > /Users/motive/Downloads/shExecute.log

while [ $# -gt 0 ]
do
    echo "$1"
    shift
done

# 표준 출력 & 에러 모두 파일로
# ...sh &> shExecuteResult.log
# 에러 내용만 파일로
# ...sh 2> shExecuteResult.log
# 표준 출력만 파일로
# ...sh > shExecuteResult.log or ...sh 1> shExecuteResult.log

# sudo /root/pipelineSh/ProfilingPipelineStart.sh $1 &> ./shExecute.log &
# /home/profiling/profilingPipelineRun.sh $1 &> ./shExecute.log &