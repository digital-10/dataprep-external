#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Use it like this"
    echo "eg) ./startup.sh 0"
    echo "arg 1 - node no"
    exit 0
fi

DPREP_NODE_IP=127.0.0.1,127.0.0.1,127.0.0.1,127.0.0.1
DPREP_NODE_PORT=9171,9173,9174,9175

# set as delimiter
IFS=','
# str is read into an array as tokens separated by IFS
read -ra NODE_IP <<< "${DPREP_NODE_IP}"
:<<'END'
# access each element of array
for i in "${NODE_IP[@]}"; do
    echo "$i"
done
END

read -ra NODE_PORT <<< "${DPREP_NODE_PORT}"
:<<'END'
# access each element of array
for i in "${NODE_PORT[@]}"; do
    echo "$i"
done
END

:<<'END'
# access each element of array
for i in "${ADDR[@]}"; do
    echo "$i"
done
END
IFS=' '

if [ $1 -ge ${#NODE_IP[@]} ]; then
  echo "The minimum value must be 0 and the maximum value must be $((${#NODE_IP[@]} - 1)) or less"
  exit 0
fi

echo "Dprep Node$1 Startup..."

DPREP_NODE=$1
DPREP_TOTAL_NODE_COUNT=${#NODE_IP[@]}
DPREP_HOME=$(pwd)
DPREP_CONF=${DPREP_HOME}/conf
DPREP_PORT=${NODE_PORT[$1]}
DPREP_COMMON=${DPREP_HOME%/*}/common
DPREP_LOG_DIR=${DPREP_HOME%/*}/logs
#DPREP_LOG_DIR=/home/profiling/logs
DPREP_LOG_FILE=dprep_node${DPREP_NODE}
DPREP_HEAP_DUMP_DIR=${DPREP_HOME%/*}/heap_dump

echo ${DPREP_HOME%/*%/*}/logs

DATASET_HOSTS=""
PREPATATION_HOSTS=""
EXPORT_HOSTS=""

for (( i=0; i<${#NODE_IP[@]}; i++ )); do
    DATASET_HOSTS+="http://${NODE_IP[i]}:${NODE_PORT[i]}"
    PREPATATION_HOSTS+="http://${NODE_IP[i]}:${NODE_PORT[i]}"
    EXPORT_HOSTS+="http://${NODE_IP[i]}:${NODE_PORT[i]}"

    if [ $i -lt $((${#NODE_IP[@]} - 1)) ]; then
        DATASET_HOSTS+=","
        PREPATATION_HOSTS+=","
        EXPORT_HOSTS+=","
    fi
done

# semantic 삭제
#rm -rf ${DPREP_COMMON}/semantic &>/dev/null
# semantic 복사
#cp -r ${DPREP_HOME}/semantic ${DPREP_COMMON} &>/dev/null

nohup ${JAVA_HOME}/bin/java -DDPrepMultinode${DPREP_NODE} \
           -Dloader.path=file:${DPREP_CONF} \
           -Dlog.dir=${DPREP_LOG_DIR} \
           -Dlog.file=${DPREP_LOG_FILE} \
           -Ddataprep.node.no=${DPREP_NODE} \
           -Ddataprep.node.count=${DPREP_TOTAL_NODE_COUNT} \
           -Ddataset.hosts=${DATASET_HOSTS} \
           -Dpreparation.hosts=${PREPATATION_HOSTS} \
           -Dexport.hosts=${PREPATATION_HOSTS} \
           -Dserver.port=${DPREP_PORT} \
           -Ddataprep.data.home=${DPREP_COMMON}/data \
           -Ddataprep.data.semantic=${DPREP_COMMON}/semantic \
           -jar ${DPREP_HOME}/externalContainer.jar \
           --spring.config.location=file:${DPREP_CONF}/quartz.properties,file:${DPREP_CONF}/config.properties,file:${DPREP_CONF}/default.properties,file:${DPREP_CONF}/application.properties \
           --spring.resources.static-locations=file:${DPREP_HOME}/resources/static/ > ../logs/nohup$1 2>&1 &
