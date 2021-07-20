#!/bin/bash
#

export service_host_url=http://localhost:8080
export base_data_file=testdata.txt
export DATE_WITH_TIME=`date +%Y%m%d-%H%M%S_`
export loop_random=1

echo 'Generating test data'
newdata_fname=${DATE_WITH_TIME}${base_data_file}

cp -v ${base_data_file} ${newdata_fname}

while [ ${loop_random} -le 5 ]
do
 loop_random=$((RANDOM % 10))
 echo -n "Something${loop_random} " >> ${newdata_fname}
done

local_word_count=`cat ${newdata_fname} | wc -w`

echo 'Uploading ${newdata_fname}'
curl -s --location --request POST "${service_host_url}/upload" --form file=@${newdata_fname}

echo 'getting server filename'
remote_file_url=`curl -s --location --request GET "${service_host_url}/files" | jq -c '.[] | select(.url | contains("'${newdata_fname}'")) | {url}' | jq -r .url`

remote_file_name=${remote_file_url/http:\/\/localhost:8080\/process/}

echo 'Processing file to get word count'
remote_word_count=`curl -s --location --request GET ${service_host_url}/process${remote_file_name} | jq -r '.[].count_of_words'`

echo 'Validating test result'
if [ ${remote_word_count} == ${local_word_count} ]
then
  echo "local_word_count: ${local_word_count} matched  remote_word_count: ${remote_word_count}"
  echo 'Test Passed'
  echo 'deleting local file'
  rm -v ${newdata_fname}
  echo 'delete remote file'
  curl -s --location --request GET ${service_host_url}/remove${remote_file_name}
  echo ""
  echo "Testing Successfully completed"
  echo ""
else
    echo "Test Failed"
fi