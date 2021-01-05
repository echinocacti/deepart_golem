#!/bin/sh
docker run \
  -v $(pwd)/resources:/golem/resources \
  -v $(pwd)/output:/golem/output \
  --entrypoint /golem/entrypoints/run.sh \
  deepart-golem:latest 

  # docker run \
  # -v $(pwd)/src:/hello-golem/resource \
  # -v $(pwd)/dist:/hello-golem/output \
  # --entrypoint /usr/local/bin/node \˜
  # deepart-golem:latest /hello-golem/work/dist/task.js /hello-golem/resource/digits.txt /hello-golem/output/output.json